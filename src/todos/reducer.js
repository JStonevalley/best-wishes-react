import { combineReducers } from 'redux'
import { Map } from 'immutable'
import {
  GET_PERSONAL_WISH_LISTS_SUCCESS,
  SET_ACTIVE_LIST,
  SET_ACTIVE_WISH,
  SAVE_WISH,
  ADD_NEW_WISH,
  CREATE_WISH_LIST
} from './actions'

const lists = (state = Map(), action) => {
  switch (action.type) {
    case CREATE_WISH_LIST: return state.set(action.wishList.get('id'), action.wishList)
    case GET_PERSONAL_WISH_LISTS_SUCCESS: return state.merge(action.wishLists.reduce((map, wishList) => map.set(wishList.get('id'), wishList), Map()))
    default: return state
  }
}

const wishes = (state = Map(), action) => {
  switch (action.type) {
    case GET_PERSONAL_WISH_LISTS_SUCCESS: return state.merge(action.wishes.reduce((map, wish) => map.set(wish.get('id'), wish), Map()))
    case SAVE_WISH: return state.set(action.wish.get('id'), action.wish).remove(null)
    case ADD_NEW_WISH: return state.set(action.wish.get('id'), action.wish)
    default: return state
  }
}

const activeWishList = (state = null, { type, listId }) => {
  switch (type) {
    case SET_ACTIVE_LIST: return listId
    default: return state
  }
}

const activeWish = (state = 'NO_WISH_SELECTED', { type, wishId }) => {
  switch (type) {
    case ADD_NEW_WISH: return null
    case SAVE_WISH:
    case SET_ACTIVE_LIST: return 'NO_WISH_SELECTED'
    case SET_ACTIVE_WISH: return wishId
    default: return state
  }
}

export default combineReducers({
  lists,
  wishes,
  activeWishList,
  activeWish
})
