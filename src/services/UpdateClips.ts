import { db, doc, updateDoc } from "../webservice/firebase";

export const UpdateClip = async (
  id: string,
  updatedData: Partial<{ title: string; tag: string[]; embed: string; videoUrl: string }>
) => {
  try {
    const clipRef = doc(db, "Clips", id);
    await updateDoc(clipRef, updatedData);
  } catch (error) {
    console.error("Error al actualizar el documento: ", error);
    throw error;
  }
};
