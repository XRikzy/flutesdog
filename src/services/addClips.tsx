
import { addDoc, collection, db } from "../webservice/firebase";

export const handleSave = async () => {
  try {
    await addDoc(collection(db, "Clips"), {
      title: "Volibear perfect farm",
      embed: "https://www.youtube.com/embed/gvCom9S7eAI?si=NiIMYFneVzELnRSV",
      tag: ["League of Legends", "Mancada"],
    });
    return "El clip ha sido agregado correctamente!!";
  } catch (error) {
    return error;
  }
};
