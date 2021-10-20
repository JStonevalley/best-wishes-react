import { useMemo } from 'react'
import {
  doc,
  getDoc,
  addDoc,
  collection,
  deleteDoc,
  getFirestore
} from 'firebase/firestore'

export const useWishListSharing = () => {
  const db = useMemo(getFirestore, [])
  const addShare = async ({ invitedEmail, sharedByUID, listId }) => {
    await addDoc(collection(db, 'share'), {
      list: doc(db, 'list', listId),
      invitedEmail,
      sharedByUID
    })
  }
  const removeShare = async (shareId) => {
    const shareDoc = await getDoc(doc(db, 'share', shareId))
    if (!shareDoc.getData().claimed) await deleteDoc(shareDoc)
  }
  return { addShare, removeShare }
}