import {
  doc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  collection,
  arrayUnion,
  arrayRemove,
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
  const removeAWish = (listId) => async (id) => {
    await await updateDoc(doc(db, 'list', listId), {
      wishes: arrayRemove(doc(db, 'wish', id))
    })
    await deleteDoc(doc(db, 'wish', id))
  }
  return { makeAWish, changeAWish, removeAWish }
}
