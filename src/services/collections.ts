import { addDoc, collection, doc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../webservice/firebase";

export interface CollectionValues {
  title: string;
  description: string;
  clipIds: string[];
  screenshotIds: string[];
}

export interface MediaCollection extends CollectionValues {
  id: string;
}

const collections = collection(db, "Collections");
const featuredDoc = doc(collections, "_featured");

export async function getCollections() {
  const snapshot = await getDocs(collections);
  const items = snapshot.docs
    .filter((item) => item.id !== featuredDoc.id)
    .map((item) => {
      const fields = item.data() as CollectionValues;
      return { ...fields, id: item.id };
    })
    .sort((a, b) => a.title.localeCompare(b.title, "es"));
  const featuredId = snapshot.docs.find((item) => item.id === featuredDoc.id)?.data().collectionId as string | undefined;
  return { items, featuredId };
}

export async function saveCollection(id: string, values: CollectionValues) {
  const data = { ...values, title: values.title.trim(), description: values.description.trim() };
  if (id) await updateDoc(doc(collections, id), data);
  else await addDoc(collections, data);
}

export function setFeaturedCollection(collectionId: string) {
  return setDoc(featuredDoc, { collectionId });
}
