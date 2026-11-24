import { addDoc, collection, doc, getDocs, runTransaction, updateDoc } from "firebase/firestore";
import { auth, db } from "../webservice/firebase";

export interface CollectionValues {
  title: string;
  description: string;
  clipIds: string[];
  screenshotIds: string[];
  coverUrl?: string;
}

export interface MediaCollection extends CollectionValues {
  id: string;
  ownerUid?: string;
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
  const user = auth.currentUser;
  if (!user) throw new Error("Inicia sesión para guardar la colección.");
  const data = { ...values, title: values.title.trim(), description: values.description.trim() };
  if (id) {
    await updateDoc(doc(collections, id), data);
    return id;
  }
  const created = await addDoc(collections, { ...data, ownerUid: user.uid });
  return created.id;
}

export function setFeaturedCollection(collectionId: string, featured: boolean) {
  if (!collectionId || collectionId === featuredDoc.id) throw new Error("Elige una colección válida.");
  return runTransaction(db, async (transaction) => {
    if (!featured) {
      const current = await transaction.get(featuredDoc);
      if (current.data()?.collectionId === collectionId) transaction.set(featuredDoc, { collectionId: "" });
      return;
    }
    const item = await transaction.get(doc(collections, collectionId));
    if (!item.exists()) throw new Error("La colección ya no está disponible.");
    transaction.set(featuredDoc, { collectionId });
  });
}

export function deleteCollection(id: string) {
  if (!id || id === featuredDoc.id) throw new Error("Elige una colección válida.");
  return runTransaction(db, async (transaction) => {
    const featured = await transaction.get(featuredDoc);
    if (featured.data()?.collectionId === id) transaction.set(featuredDoc, { collectionId: "" });
    transaction.delete(doc(collections, id));
  });
}
