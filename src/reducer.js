import { combineReducers } from 'redux'
import wishListReducer from './workshop/reducer'

const reducers = {
  workshop: wishListReducer
}

export default combineReducers(reducers)
