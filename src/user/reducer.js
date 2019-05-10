import { combineReducers } from 'redux'
import { SIGN_IN, SIGN_UP } from './actions'

const cognito = (state = null, { type, user }) => {
  switch (type) {
    case SIGN_IN:
    case SIGN_UP:
      return user || state
    default:
      return state
  }
}

const signInTried = (state = false, { type, user }) => {
  switch (type) {
    case SIGN_IN:
    case SIGN_UP:
      return true
    default:
      return state
  }
}

export default combineReducers({
  cognito,
  signInTried
})
