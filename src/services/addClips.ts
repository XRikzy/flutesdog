import { AddClipValues } from "../constants/documents";
import { addDoc, collection, db } from "../webservice/firebase";

export const AddClips = async ({ title, embed, videoUrl, thumbnailUrl, tag }: AddClipValues) => {
  await addDoc(collection(db, "Clips"), {
    title,
    ...(videoUrl ? { videoUrl } : { embed }),
    ...(thumbnailUrl ? { thumbnailUrl } : {}),
    tag,
    createdAt: new Date().toISOString(),
  });
};
