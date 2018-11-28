import { combineReducers } from 'redux'
import wishListReducer from './todos/reducer'
import sharedReducer from './shared/reducer'

const reducers = {
  wishLists: wishListReducer,
  shared: sharedReducer
}

export default combineReducers(reducers)
