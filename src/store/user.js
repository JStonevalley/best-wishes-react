import React, { useContext, useEffect, useReducer } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useBaseState } from './lists'

const UserContext = React.createContext()

const ACTION_TYPES = {
  LOGIN: 'LOGIN',
  USER_FETCHED: 'USER_FETCHED',
  LOGOUT: 'LOGOUT'
}

const userReducer = (state, { type, googleUser, user }) => {
  switch (type) {
    case ACTION_TYPES.LOGIN:
      return { ...state, googleUser }
    case ACTION_TYPES.USER_FETCHED:
      return { ...state, user }
    case ACTION_TYPES.LOGOUT:
      return { googleUser: null, user: null }
    default: {
      throw new Error(`Unhandled action type: ${type}`)
    }
  }
}

const UserProvider = ({ children }) => {
  const [userState, dispatch] = useReducer(userReducer, {
    user: undefined,
    googleUser: undefined
  })
  useEffect(() => {
    onAuthStateChanged(getAuth(), (googleUser) => {
      if (googleUser) {
        dispatch({ type: ACTION_TYPES.LOGIN, googleUser })
      } else {
        dispatch({ type: ACTION_TYPES.LOGOUT })
      }
    })
  }, [])
  useBaseState()
  return (
    <UserContext.Provider value={userState}>{children}</UserContext.Provider>
  )
}

const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

export { UserProvider, useUser }
