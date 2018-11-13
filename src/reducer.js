import {combineReducers} from 'redux'
import wishListReducer from './todos/reducer'

const reducers = {
  wishLists: wishListReducer
}

export default combineReducers(reducers)
