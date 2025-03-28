import { getDoc, doc } from 'firebase/firestore'
import { db } from '../../webservice/firebase'

export const getUserRole = async (userId: string) => {
  const userDoc = doc(db, 'User', userId)
  const userSnapshot = await getDoc(userDoc)

  if (userSnapshot.exists()) {
    return userSnapshot.data().role
  } else {
    return null
  }
}
