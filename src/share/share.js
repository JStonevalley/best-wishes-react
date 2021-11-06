import { useMemo } from 'react'
import {
  doc,
  getDoc,
  addDoc,
  collection,
  deleteDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getFirestore
} from 'firebase/firestore'

export const useWishListSharing = () => {
  const db = useMemo(getFirestore, [])
  const addShare = async ({ invitedEmail, sharedByUID, listId }) => {
    const shareDoc = await addDoc(collection(db, 'share'), {
      list: doc(db, 'list', listId),
      invitedEmail,
      sharedByUID
    })
    await updateDoc(doc(db, 'list', listId), {
      shares: arrayUnion(shareDoc)
    })
  }
  const removeShare = async (shareId) => {
    const shareDoc = await getDoc(doc(db, 'share', shareId))
    if (!shareDoc.data().claimed) {
      await updateDoc(shareDoc.data().list, {
        shares: arrayRemove(shareDoc.ref)
      })
      await deleteDoc(shareDoc.ref)
    }
  }
  return { addShare, removeShare }
}
