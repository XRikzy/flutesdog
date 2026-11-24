import {
  collection,
  DocumentData,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../webservice/firebase";
import { Ivideos } from "../constants/documents";

function toClip(id: string, data: DocumentData): Ivideos {
  return {
    id,
    title: data.title || "",
    tag: data.tag || [],
    embed: data.embed || "",
    videoUrl: data.videoUrl || "",
    thumbnailUrl: data.thumbnailUrl || "",
    createdAt: data.createdAt || "",
  };
}

export async function getClipById(id: string): Promise<Ivideos | null> {
  if (!id || id.includes("/") || id === "." || id === "..") return null;
  const snapshot = await getDoc(doc(db, "Clips", id));
  return snapshot.exists() ? toClip(snapshot.id, snapshot.data()) : null;
}

export const getClips = async (): Promise<Ivideos[]> => {
  const snapshot = await getDocs(collection(db, "Clips"));
  return snapshot.docs.map((clip) => toClip(clip.id, clip.data()));
};
export const getClipsByTitle = async (term: string) => {
  try {
    const clipsRef = collection(db, "Clips");
    const q = query(clipsRef, where("title", "==", term));

    const querySnapshot = await getDocs(q);

    const results = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || "",
        tag: data.tag || [],
        embed: data.embed || "",
        videoUrl: data.videoUrl || "",
        createdAt: data.createdAt || "",
      } as Ivideos;
    });
    console.log(results);
    return results;
  } catch (error) {
    console.error("Error fetching documents: ", error);
    return [];
  }
};
