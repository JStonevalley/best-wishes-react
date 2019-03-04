import { combineReducers } from 'redux'
import wishListReducer from './workshop/reducer'
import userReducer from './user/reducer'

const reducers = {
  workshop: wishListReducer,
  user: userReducer
}

export default combineReducers(reducers)
