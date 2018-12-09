import { combineReducers } from 'redux'
import {
  USER_SIGNED_IN
} from './actions'

const user = (state = null, { type, user }) => {
  if (type === USER_SIGNED_IN) return user
  return state
}

export default combineReducers({
  user
})
