import { AddClipValues } from "../constants/documents";
import { addDoc, collection, db } from "../webservice/firebase";

export const AddClips = async ({ title, embed, videoUrl, tag }: AddClipValues) => {
  try {
    await addDoc(collection(db, "Clips"), {
      title,
      // Guarda solo el campo relevante según el tipo de clip
      ...(videoUrl ? { videoUrl } : { embed }),
      tag,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    return error;
  }
};
