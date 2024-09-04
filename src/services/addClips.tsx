
import { addDoc, collection, db } from "../webservice/firebase";

export const handleSave = async () => {
  try {
    await addDoc(collection(db, "Clips"), {
      dataField:"",

      timestamp: new Date(),
    });
    console.log("Document successfully written!");
  } catch (error) {
    console.error("Error writing document: ", error);
  }
};
