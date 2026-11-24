import type { Ivideos } from "../constants/documents";
import { IMAGEKIT_ENDPOINT, withImageKitTransform } from "./imageKit";

export function isThumbnailUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password;
  } catch {
    return false;
  }
}

export function getClipThumbnail({ thumbnailUrl, videoUrl, embed }: Pick<Ivideos, "thumbnailUrl" | "videoUrl" | "embed">) {
  if (thumbnailUrl && isThumbnailUrl(thumbnailUrl)) return thumbnailUrl;
  if (videoUrl?.startsWith(IMAGEKIT_ENDPOINT)) {
    const image = videoUrl.split(/[?#]/, 1)[0].replace(/\.[^./]+$/, ".jpg");
    return withImageKitTransform(image, "so-2,w-640");
  }
  const videoId = embed?.match(/^https:\/\/(?:www\.)?youtube(?:-nocookie)?\.com\/embed\/([\w-]{11})(?:[/?#]|$)/)?.[1];
  return videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : undefined;
}
