import React, { useContext, useEffect, useReducer } from 'react'
import { subscribeToOwnDocumentsInCollection } from './utils'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

const ListsContext = React.createContext()

const ACTION_TYPES = {
  LISTS_UPDATE: 'LISTS_UPDATE',
  WISHES_UPDATE: 'WISHES_UPDATE'
}

const listsReducer = (state, { type, lists = {}, wishes = {} }) => {
  switch (type) {
    case ACTION_TYPES.LISTS_UPDATE:
      return { ...state, lists: { ...state.lists, ...lists } }
    case ACTION_TYPES.WISHES_UPDATE:
      return { ...state, wishes: { ...state.wishes, ...wishes } }
    default: {
      throw new Error(`Unhandled action type: ${type}`)
    }
  }
}

const ListsProvider = ({ children }) => {
  const [listsAndWishes, dispatch] = useReducer(listsReducer, {
    lists: {},
    wishes: {}
  })
  useEffect(() => {
    onAuthStateChanged(getAuth(), async (user) => {
      if (user) {
        subscribeToOwnDocumentsInCollection(user)('list')((data) =>
          dispatch({ type: ACTION_TYPES.LISTS_UPDATE, lists: data })
        )
        subscribeToOwnDocumentsInCollection(user)('wish')((data) =>
          dispatch({ type: ACTION_TYPES.WISHES_UPDATE, wishes: data })
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

const useLists = () => {
  const context = useContext(ListsContext)
  if (context === undefined) {
    throw new Error('useLists must be used within a ListsProvider')
  }
  return context
}

export { ListsProvider, useLists }
