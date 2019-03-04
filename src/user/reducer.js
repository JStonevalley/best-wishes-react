import { combineReducers } from 'redux'
import { SIGN_IN, SIGN_UP } from './actions'
import { Map } from 'immutable'

const cognito = (state = Map(), { type, user }) => {
  switch (type) {
    case SIGN_IN:
    case SIGN_UP:
      return user
    default:
      return state
  }
}

export default combineReducers({
  cognito
})
