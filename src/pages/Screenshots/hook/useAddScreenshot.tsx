import { useCallback, useEffect, useState } from "react";
import {
  authenticateScreeshotService,
  getScreenshotImages,
} from "../service/screenshot.service";
import { Images } from "../decorators/UImages";

export const useAddScreenshot = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [images, setImages] = useState<Images[]>([]);
  const publicKey = "public_4e8z8SiIt6dIJn8XIwm4T1pjqpc=";
  const urlEndpoint = "https://ik.imagekit.io/ru9ftzizk/";
  const authenticator = async () => {
    try {
      return authenticateScreeshotService();
    } catch (error) {
      throw new Error(`Authentication request failed: ${error}`);
    }
  };
  const fetchImages = useCallback(async () => {
    try {
      const data = await getScreenshotImages();
      setImages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error obteniendo imágenes:", error);
      setImages([]);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchImages();
  }, [fetchImages]);
  return {
    authenticator,
    fetchImages,
    loading,
    images,
    publicKey,
    urlEndpoint,
  };
};
