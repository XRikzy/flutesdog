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
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching documents: ", error);
    return [];
  }
};
