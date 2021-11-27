import { useEffect } from 'react'
import { getDocumentsForUserInCollection } from './utils'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useSetRecoilState, atom } from 'recoil'

export const ownListsState = atom({
  key: 'ownLists',
  default: {},
  dangerouslyAllowMutability: true
})

export const ownWishesState = atom({
  key: 'ownWishes',
  default: {},
  dangerouslyAllowMutability: true
})

export const ownSharesState = atom({
  key: 'ownShares',
  default: {},
  dangerouslyAllowMutability: true
})

export const useBaseState = () => {
  const setOwnLists = useSetRecoilState(ownListsState)
  const setOwnWishes = useSetRecoilState(ownWishesState)
  const setOwnShares = useSetRecoilState(ownSharesState)
  useEffect(() => {
    onAuthStateChanged(getAuth(), async (user) => {
      if (user) {
        getDocumentsForUserInCollection(user, {
          userUIDKey: 'ownerUID'
        })('list').then(setOwnLists)
        getDocumentsForUserInCollection(user, {
          userUIDKey: 'ownerUID'
        })('wish').then(setOwnWishes)
        getDocumentsForUserInCollection(user, {
          userUIDKey: 'sharedByUID'
        })('share').then(setOwnShares)
      }
    })
  }, [setOwnLists, setOwnWishes, setOwnShares])
}
