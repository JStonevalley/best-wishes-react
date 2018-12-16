import { combineReducers } from 'redux'
import wishListReducer from './workshop/reducer'
import sharedReducer from './shared/reducer'

const reducers = {
  wishLists: wishListReducer,
  shared: sharedReducer
}

export default combineReducers(reducers)
