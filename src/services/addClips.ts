import { AddClipValues } from "../constants/documents";
import { addDoc, collection, db } from "../webservice/firebase";

export const handleSave = async ({ title, embed, tag }: AddClipValues) => {
  try {
    await addDoc(collection(db, "Clips"), {
      title,
      embed,
      tag,
    });
  } catch (error) {
    return error;
  }
};
