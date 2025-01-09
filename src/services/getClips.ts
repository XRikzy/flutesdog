import {
  collection,
  DocumentData,
  getDocs,
  query,
  QuerySnapshot,
  where,
} from "firebase/firestore";
import { db } from "../webservice/firebase";
import { Ivideos } from "../constants/documents";
export const getClips = async (): Promise<Ivideos[]> => {
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
export const getClipsByTitle = async (term: string) => {
  try {
    const clipsRef = collection(db, "Clips");
    const q = query(clipsRef, where("title", "==", term));

    const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);

    const results = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || "",
        tag: data.tag || [],
        embed: data.embed || "",
      } as Ivideos;
    });
    console.log(results);
    return results;
  } catch (error) {
    console.error("Error fetching documents: ", error);
    return [];
  }
};
