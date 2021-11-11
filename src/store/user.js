import React, { useContext, useEffect, useReducer } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useBaseState } from './lists'

const UserContext = React.createContext()

const ACTION_TYPES = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT'
}

const userReducer = (state, { type, user }) => {
  switch (type) {
    case ACTION_TYPES.LOGIN:
      return { user }
    case ACTION_TYPES.LOGOUT:
      return { user: null }
    default: {
      throw new Error(`Unhandled action type: ${type}`)
    }
  }
}

const UserProvider = ({ children }) => {
  const [user, dispatch] = useReducer(userReducer, { user: undefined })
  useEffect(() => {
    onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        dispatch({ type: ACTION_TYPES.LOGIN, user })
      } else {
        dispatch({ type: ACTION_TYPES.LOGOUT })
      }
    })
  }, [])
  useBaseState()
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>
}

const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context.user
}

export { UserProvider, useUser }
