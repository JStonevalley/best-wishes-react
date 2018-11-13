import {combineReducers} from 'redux'
import {Map} from 'immutable'
import {
  GET_PERSONAL_WISH_LISTS_SUCCESS,
  SET_ACTIVE_LIST,
  SET_ACTIVE_WISH,
  SAVE_WISH
} from './actions'

const lists = (state = Map(), action) => {
  switch (action.type) {
    case GET_PERSONAL_WISH_LISTS_SUCCESS: return action.wishLists
    case SAVE_WISH: {
      return state.setIn([action.listId, 'wishes', action.wish.get('id')], action.wish)
    }
    default: return state
  }
}

const activeWishList = (state = null, {type, listId}) => {
  switch (type) {
    case SET_ACTIVE_LIST: return listId
    default: return state
  }
}

const activeWish = (state = null, {type, wishId}) => {
  switch (type) {
    case SET_ACTIVE_LIST: return null
    case SET_ACTIVE_WISH: return wishId
    default: return state
  }
}

export default combineReducers({
  lists,
  activeWishList,
  activeWish
})
