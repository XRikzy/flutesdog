import { db, deleteDoc, doc } from "../webservice/firebase";

export const DeleteClips = async (id: string) => {
  try {
    await deleteDoc(doc(db, "Clips", id));
  } catch (error) {
    return error;
  }
};
