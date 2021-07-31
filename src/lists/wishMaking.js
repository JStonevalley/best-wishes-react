import {
  doc,
  setDoc,
  addDoc,
  updateDoc,
  collection,
  arrayUnion,
  getFirestore
} from 'firebase/firestore'

export const useWishMaking = () => {
  const db = getFirestore()
  const makeAWish = (listId) => async (wish) => {
    const wishDoc = await addDoc(collection(db, 'wish'), wish)
    await updateDoc(doc(db, 'list', listId), {
      wishes: arrayUnion(wishDoc)
    })
  }
  const changeAWish = (id) => (wish) => setDoc(doc(db, 'wish', id), wish)
  return { makeAWish, changeAWish }
}
