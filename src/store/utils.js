import {
  collection,
  query,
  where,
  onSnapshot,
  getFirestore
} from 'firebase/firestore'

export const subscribeToDocumentsForUserInCollection = (
  user,
  { userUIDKey }
) => (coll) => (onDocuments) => {
  const q = query(
    collection(getFirestore(), coll),
    where(userUIDKey, '==', user.uid)
  )
  onSnapshot(q, (querySnapshot) => {
    const documents = {}
    querySnapshot.forEach((doc) => {
      documents[doc.id] = doc
    })
    onDocuments(documents)
  })
}
