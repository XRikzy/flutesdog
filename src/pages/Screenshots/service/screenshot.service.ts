import { AxiosScreenshot } from "../../../config/axios";
import { mediaAuthHeaders } from "../../../services/uploadMedia";
import { Images } from "../decorators/UImages";

export async function getScreenshotImages() {
  const { data } = await AxiosScreenshot.get<Images[]>("/images");
  return data;
}

export async function deleteScreenshotImage(fileId: string) {
  await AxiosScreenshot.delete(`/images/${encodeURIComponent(fileId)}`, {
    headers: await mediaAuthHeaders(),
  });
}
