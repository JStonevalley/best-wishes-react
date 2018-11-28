import { combineReducers } from 'redux'
import { Map } from 'immutable'
import {
  USER_SIGNED_IN
} from './actions'

const user = (state = Map(), { type, user }) => {
  if (type === USER_SIGNED_IN) return Map({ email: user })
  return state
}

export default combineReducers({
  user
})
