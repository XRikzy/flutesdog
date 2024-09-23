import {
  collection,
  DocumentData,
  getDocs,
  QuerySnapshot,
} from "firebase/firestore";
import { db } from "../webservice/firebase";
import { Ivideos } from "../constants/documents";
export const fetchData = async (): Promise<Ivideos[]> => {
  try {
    const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(
      collection(db, "Clips")
    );
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || "",
        tag: data.tag || [],
        embed: data.embed || "",
      } as Ivideos;
    });
  } catch (error) {
    console.error("Error fetching documents: ", error);
    return [];
  }
};
