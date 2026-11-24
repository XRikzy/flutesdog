import { useCallback, useEffect, useState } from "react";
import { notifications } from "@mantine/notifications";
import { getScreenshotImages } from "../service/screenshot.service";
import { Images } from "../decorators/UImages";
import { uploadMedia } from "../../../services/uploadMedia";

export const useAddScreenshot = () => {
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<Images[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const fetchImages = useCallback(async () => {
    try {
      const data = await getScreenshotImages();
      setImages(Array.isArray(data) ? data : []);
    } catch {
      notifications.show({ title: "Error", message: "No pudimos cargar las screenshots.", color: "red" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchImages();
  }, [fetchImages]);

  const addScreenshot = async (file?: File) => {
    if (!file || uploading) return;
    setUploading(true);
    setProgress(0);
    try {
      await uploadMedia(file, "screenshot", setProgress);
      await fetchImages();
      notifications.show({ title: "¡Agregado!", message: "Screenshot subida correctamente." });
    } catch (error) {
      notifications.show({
        title: "Error de subida",
        message: error instanceof Error ? error.message : "No pudimos subir la imagen.",
        color: "red",
      });
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return { fetchImages, loading, images, addScreenshot, uploading, progress };
};
