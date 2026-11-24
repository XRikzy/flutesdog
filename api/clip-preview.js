import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const siteName = "Perro Flautas";
const imageKit = "https://ik.imagekit.io/ru9ftzizk/";
const youtubeHosts = new Set(["youtube.com", "www.youtube.com", "www.youtube-nocookie.com"]);

const entities = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
const escapeHtml = (value) => value.replace(/[&<>"']/g, (char) => entities[char]);
const meta = (attribute, name, value) => `<meta ${attribute}="${name}" content="${escapeHtml(value)}">`;
const clipTitle = (value) => typeof value === "string" ? value.trim().slice(0, 120) : "";

function publicUrl(value) {
  if (typeof value !== "string" || !value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password ? url : null;
  } catch {
    return null;
  }
}

export function renderClipPreview(html, canonical, clip) {
  const title = clipTitle(clip.title) || "Clip";
  const tags = clip.tags.map(clipTitle).filter(Boolean);
  const description = (tags.length ? `Clip de Perro Flautas · ${tags.join(" · ")}` : "Mira este clip de Perro Flautas.").slice(0, 80);
  const video = publicUrl(clip.videoUrl);
  const embed = publicUrl(clip.embed);
  const videoId = youtubeHosts.has(embed?.hostname) && embed.pathname.match(/^\/embed\/([\w-]{11})\/?$/)?.[1];
  const imageKitPath = video?.href.startsWith(imageKit) ? video.pathname.split("/").slice(2).join("/") : "";
  const poster = publicUrl(clip.thumbnailUrl)?.href
    || (imageKitPath && `${imageKit}tr:so-2,w-640/${imageKitPath.replace(/^tr:[^/]+\//, "").replace(/\.[^.\/]+$/, ".jpg")}`)
    || (videoId && `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`)
    || new URL("/assets/hero.png", canonical).href;
  const mp4 = video && !video.search && /\.mp4$/i.test(video.pathname) ? video.href : null;
  const tagsHtml = [
    meta("property", "og:type", "video.other"),
    meta("property", "og:title", title),
    meta("property", "og:description", description),
    meta("property", "og:url", canonical.href),
    meta("property", "og:site_name", siteName),
    meta("property", "og:image", poster),
    meta("property", "og:image:alt", `Portada del clip ${title}`),
    meta("name", "twitter:card", "summary_large_image"),
    `<link rel="canonical" href="${escapeHtml(canonical.href)}">`,
  ];
  if (mp4) {
    tagsHtml.push(meta("property", "og:video", mp4), meta("property", "og:video:type", "video/mp4"));
  }
  return html
    .replace(/<title>[^<]*<\/title>/i, () => `<title>${escapeHtml(title)} | ${siteName}</title>`)
    .replace(/<meta name="description"[^>]*>/i, () => meta("name", "description", description))
    .replace("<!-- clip-preview -->", () => tagsHtml.join("\n    "));
}

async function loadClip(id) {
  const project = process.env.VITE_PROJECTID;
  if (!/^[a-z0-9-]+$/.test(project || "")) throw new Error("VITE_PROJECTID no configurado");
  const root = `https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents/Clips`;
  const mask = ["title", "tag", "videoUrl", "embed", "thumbnailUrl"].map((field) => `mask.fieldPaths=${field}`).join("&");
  const response = await fetch(`${root}/${encodeURIComponent(id)}?${mask}`, { signal: AbortSignal.timeout(5000) });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Firestore HTTP ${response.status}`);
  const { fields = {} } = await response.json();
  return {
    title: fields.title?.stringValue,
    tags: (fields.tag?.arrayValue?.values || []).map((value) => value.stringValue),
    videoUrl: fields.videoUrl?.stringValue,
    embed: fields.embed?.stringValue,
    thumbnailUrl: fields.thumbnailUrl?.stringValue,
  };
}

export default async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", "GET, HEAD");
    return res.status(405).end();
  }
  const html = await readFile(resolve("dist/index.html"), "utf8");
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  const id = req.query.clipId;
  if (typeof id !== "string" || !id || id.length > 1500 || /[\/\\]/.test(id) || id === "." || id === "..") {
    return res.status(404).send(html);
  }

  try {
    const clip = await loadClip(id);
    if (!clip) return res.status(404).send(html);
    const origin = new URL(process.env.SITE_URL || `https://${req.headers.host}`);
    const canonical = new URL(`/clips/${encodeURIComponent(id)}`, origin);
    res.setHeader("Cache-Control", "public, max-age=0, s-maxage=300");
    return res.status(200).send(renderClipPreview(html, canonical, clip));
  } catch (error) {
    console.error("Vista previa de clip:", error.message);
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).send(html);
  }
}
