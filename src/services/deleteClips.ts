import { DeleteClipValue } from "../constants/documents";
import { db, deleteDoc, doc } from "../webservice/firebase";

export const handleDelete = async ({ id }: DeleteClipValue) => {
  try {
    await deleteDoc(doc(db, "Clips", id));
  } catch (error) {
    return error;
  }
};