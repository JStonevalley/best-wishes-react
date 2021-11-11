import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
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

export const getDocumentsForUserInCollection = (user, { userUIDKey }) => async (
  coll
) => {
  const q = query(
    collection(getFirestore(), coll),
    where(userUIDKey, '==', user.uid)
  )
  const documents = {}
  const querySnapshot = await getDocs(q)
  querySnapshot.forEach((doc) => {
    documents[doc.id] = doc
  })
  return documents
}
