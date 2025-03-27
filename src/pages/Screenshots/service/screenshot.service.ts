import { AxiosScreenshot } from "../../../config/axios";

export const getScreenshotImages = async () => {
  try {
    const response = await AxiosScreenshot.get("/images");
    return response.data;
  } catch (error) {
    console.log("Error en fetching de datos", error);
  }
};
export const authenticateScreeshotService = async () => {
  try {
    const response = await AxiosScreenshot.get("/auth");
    const { signature, expire, token } = response.data;
    return { signature, expire, token };
  } catch (error) {
    console.log("Hubo un error en authentificar los datos", error);
  }
};
