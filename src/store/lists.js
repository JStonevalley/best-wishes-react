import React, { useContext, useEffect, useReducer } from 'react'
import { subscribeToDocumentsForUserInCollection } from './utils'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

const ListsContext = React.createContext()

const ACTION_TYPES = {
  LISTS_UPDATE: 'LISTS_UPDATE',
  WISHES_UPDATE: 'WISHES_UPDATE',
  SHARES_UPDATE: 'SHARES_UPDATE'
}

const listsReducer = (
  state,
  { type, lists = {}, wishes = {}, shares = {} }
) => {
  switch (type) {
    case ACTION_TYPES.LISTS_UPDATE:
      return { ...state, lists: { ...state.lists, ...lists } }
    case ACTION_TYPES.WISHES_UPDATE:
      return { ...state, wishes: { ...state.wishes, ...wishes } }
    case ACTION_TYPES.SHARES_UPDATE:
      return { ...state, shares: { ...state.shares, ...shares } }
    default: {
      throw new Error(`Unhandled action type: ${type}`)
    }
  }
}

const OwnerListsProvider = ({ children }) => {
  const [listsAndWishes, dispatch] = useReducer(listsReducer, {
    lists: undefined,
    wishes: undefined,
    shares: undefined
  })
  useEffect(() => {
    onAuthStateChanged(getAuth(), async (user) => {
      if (user) {
        subscribeToDocumentsForUserInCollection(user, {
          userUIDKey: 'ownerUID'
        })('list')((lists) =>
          dispatch({ type: ACTION_TYPES.LISTS_UPDATE, lists })
        )
        subscribeToDocumentsForUserInCollection(user, {
          userUIDKey: 'ownerUID'
        })('wish')((wishes) =>
          dispatch({ type: ACTION_TYPES.WISHES_UPDATE, wishes })
        )
        subscribeToDocumentsForUserInCollection(user, {
          userUIDKey: 'sharedByUID'
        })('share')((shares) =>
          dispatch({ type: ACTION_TYPES.SHARES_UPDATE, shares })
        )
      }
    })
  }, [])
  return (
    <ListsContext.Provider value={listsAndWishes}>
      {children}
    </ListsContext.Provider>
  )
}

const useOwnLists = () => {
  const context = useContext(ListsContext)
  if (context === undefined) {
    throw new Error('useOwnLists must be used within a OwnerListsProvider')
  }
  return context
}

export { OwnerListsProvider, useOwnLists }
