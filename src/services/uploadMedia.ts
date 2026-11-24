import axios from "axios";
import { AxiosScreenshot } from "../config/axios";
import { auth } from "../webservice/firebase";

export async function mediaAuthHeaders() {
  const user = auth.currentUser;
  if (!user) throw new Error("Inicia sesión con Google para continuar.");
  return { Authorization: `Bearer ${await user.getIdToken()}` };
}

async function isStaticPng(file: File) {
  const png = new DataView(await file.arrayBuffer());
  // An animated PNG has an acTL chunk before the first IDAT chunk.
  for (let offset = 8; offset + 12 <= png.byteLength;) {
    const chunkType = png.getUint32(offset + 4);
    if (chunkType === 0x6163544c) return false; // acTL
    if (chunkType === 0x49444154) return true; // IDAT
    offset += 12 + png.getUint32(offset);
  }
  return false;
}

async function compressScreenshot(file: File): Promise<File> {
  if (file.type !== "image/jpeg" && file.type !== "image/png") return file;

  try {
    if (file.type === "image/png" && !await isStaticPng(file)) return file;

    const image = await createImageBitmap(file);
    const canvas = document.createElement("canvas");
    try {
      canvas.width = image.width;
      canvas.height = image.height;
      const context = canvas.getContext("2d");
      if (!context) return file;
      context.drawImage(image, 0, 0);
    } finally {
      image.close();
    }

    const webp = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", 0.85));
    if (!webp || webp.type !== "image/webp" || !webp.size || webp.size >= file.size) return file;

    const name = `${file.name.replace(/\.[^.]+$/, "")}.webp`;
    return new File([webp], name, { type: webp.type, lastModified: file.lastModified });
  } catch {
    return file;
  }
}

async function waitForClip(uploadId: string) {
  const deadline = Date.now() + 15 * 60_000;
  while (Date.now() < deadline) {
    const headers = await mediaAuthHeaders();
    const result = await AxiosScreenshot.get<{ status: "processing" | "failed" } | { status: "ready"; url: string }>(
      `/uploads/clips/${encodeURIComponent(uploadId)}`, { headers, timeout: 10_000 },
    ).catch((error: unknown) => {
      if (!axios.isAxiosError(error) || (error.response && error.response.status < 500)) throw error;
      return null;
    });
    if (result?.data.status === "ready") return result.data.url;
    if (result?.data.status === "failed") throw new Error("No se pudo comprimir el video. Revisa que se reproduzca e inténtalo de nuevo.");
    await new Promise<void>((resolve) => window.setTimeout(resolve, 5000));
  }
  throw new Error("El video sigue pendiente de procesamiento. Contacta al administrador antes de volver a subirlo.");
}

export async function uploadMedia(
  file: File,
  kind: "clip" | "screenshot" | "collection-cover" | "clip-thumbnail",
  onProgress: (percent: number) => void,
  onProcessing?: () => void,
) {
  const headers = await mediaAuthHeaders();
  const uploadFile = kind !== "clip" ? await compressScreenshot(file) : file;
  const { data } = await AxiosScreenshot.post<{ uploadUrl: string; url?: string; uploadId?: string }>("/uploads", {
    kind,
    name: uploadFile.name,
    contentType: uploadFile.type,
    size: uploadFile.size,
  }, { headers }).catch((error: unknown) => {
    if (!axios.isAxiosError(error)) throw error;
    const message = error.response?.data?.error;
    throw new Error(typeof message === "string" ? message : "No pudimos preparar la subida en la API de Flutesdog.");
  });
  if (kind === "clip" && !data.uploadId) throw new Error("La API de procesamiento de clips aún no está disponible.");

  try {
    await axios.put(data.uploadUrl, uploadFile, {
      headers: { "Content-Type": uploadFile.type },
      onUploadProgress: ({ loaded }) => onProgress(Math.min(100, Math.round(loaded / uploadFile.size * 100))),
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error("No se pudo transferir el archivo a Cloudflare R2.");
    }
    throw error;
  }
  if (kind === "clip" && data.uploadId) {
    onProcessing?.();
    return waitForClip(data.uploadId);
  }
  if (!data.url) throw new Error("La API no devolvió una URL para la imagen.");
  return data.url;
}
