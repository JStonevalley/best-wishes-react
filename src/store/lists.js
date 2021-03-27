import React, { useContext, useEffect, useReducer } from 'react'
import { subscribeToOwnDocumentsInCollection } from './utils'
import firebase from 'firebase/app'
import 'firebase/auth'

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
  const [lists, dispatch] = useReducer(listsReducer, { lists: {}, wishes: {} })
  useEffect(() => {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        const newLists = await subscribeToOwnDocumentsInCollection(user)('list')
        dispatch({ type: ACTION_TYPES.LISTS_UPDATE, lists: newLists })
        const newWishes = await subscribeToOwnDocumentsInCollection(user)(
          'wish'
        )
        dispatch({ type: ACTION_TYPES.WISHES_UPDATE, wishes: newWishes })
      }
    })
  }, [])
  return <ListsContext.Provider value={lists}>{children}</ListsContext.Provider>
}

const useLists = () => {
  const context = useContext(ListsContext)
  if (context === undefined) {
    throw new Error('useLists must be used within a ListsProvider')
  }
  return context
}

export { ListsProvider, useLists }
