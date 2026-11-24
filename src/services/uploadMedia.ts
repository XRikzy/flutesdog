import axios from "axios";
import { AxiosScreenshot } from "../config/axios";
import { auth } from "../webservice/firebase";

export async function mediaAuthHeaders() {
  const user = auth.currentUser;
  if (!user) throw new Error("Inicia sesión con Google para continuar.");
  return { Authorization: `Bearer ${await user.getIdToken()}` };
}

export async function uploadMedia(
  file: File,
  kind: "clip" | "screenshot",
  onProgress: (percent: number) => void,
) {
  const headers = await mediaAuthHeaders();
  const { data } = await AxiosScreenshot.post<{ uploadUrl: string; url: string }>("/uploads", {
    kind,
    name: file.name,
    contentType: file.type,
    size: file.size,
  }, { headers }).catch((error: unknown) => {
    if (!axios.isAxiosError(error)) throw error;
    const message = error.response?.data?.error;
    throw new Error(typeof message === "string" ? message : "No pudimos preparar la subida en la API de Flutesdog.");
  });

  try {
    await axios.put(data.uploadUrl, file, {
      headers: { "Content-Type": file.type },
      onUploadProgress: ({ loaded }) => onProgress(Math.min(100, Math.round(loaded / file.size * 100))),
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error("No se pudo transferir el archivo a Cloudflare R2.");
    }
    throw error;
  }
  return data.url;
}
