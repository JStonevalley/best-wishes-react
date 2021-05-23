import {
  collection,
  query,
  where,
  onSnapshot,
  getFirestore
} from 'firebase/firestore'

export const subscribeToOwnDocumentsInCollection = (user) => (coll) => (
  onData
) => {
  const q = query(
    collection(getFirestore(), coll),
    where('ownerUID', '==', user.uid)
  )
  onSnapshot(q, (querySnapshot) => {
    const data = {}
    querySnapshot.forEach((doc) => {
      data[doc.id] = doc.data()
    })
    onData(data)
  })
}
