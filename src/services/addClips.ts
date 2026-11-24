import { AddClipValues } from "../constants/documents";
import { addDoc, collection, db } from "../webservice/firebase";

export const AddClips = async ({ title, embed, videoUrl, tag }: AddClipValues) => {
  await addDoc(collection(db, "Clips"), {
    title,
    ...(videoUrl ? { videoUrl } : { embed }),
    tag,
    createdAt: new Date().toISOString(),
  });
};
