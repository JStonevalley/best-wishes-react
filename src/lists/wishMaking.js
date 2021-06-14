import {
  doc,
  setDoc,
  addDoc,
  collection,
  getFirestore
} from 'firebase/firestore'

export const useWishMaking = () => {
  const db = getFirestore()
  const makeAWish = (wish) =>
    console.log(wish) || addDoc(collection(db, 'wish'), wish)
  const changeAWish = (id) => (wish) => setDoc(doc(db, 'wish', id), wish)
  return { makeAWish, changeAWish }
}
