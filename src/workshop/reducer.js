import { combineReducers } from 'redux'
import { Map } from 'immutable'
import {
  GET_PERSONAL_WISH_LISTS_SUCCESS,
  WISH_SAVED,
  CREATE_WISH_LIST,
  WISH_DELETED,
  WISH_LIST_SHARED,
  WISH_LIST_REMOVED
} from './actions'
import {
  WISH_LIST_SHARE_FETCHED,
  GRANT_WISH,
  REVOKE_WISH
} from '../shares/actions'

const lists = (state = Map(), action) => {
  switch (action.type) {
    case WISH_LIST_SHARE_FETCHED:
    case CREATE_WISH_LIST:
      return state.set(action.wishList.get('id'), action.wishList)
    case WISH_LIST_REMOVED:
      return state.delete(action.wishList.get('id'))
    case GET_PERSONAL_WISH_LISTS_SUCCESS:
      return state.merge(
        action.wishLists.reduce(
          (map, wishList) => map.set(wishList.get('id'), wishList),
          Map()
        )
      )
    default:
      return state
  }
}

const wishes = (state = Map(), action) => {
  switch (action.type) {
    case WISH_LIST_SHARE_FETCHED:
    case GET_PERSONAL_WISH_LISTS_SUCCESS:
      return state.merge(
        action.wishes.reduce(
          (map, wish) => map.set(wish.get('id'), wish),
          Map()
        )
      )
    case WISH_SAVED:
      return state.set(action.wish.get('id'), action.wish).remove(null)
    case WISH_DELETED:
      return state.delete(action.id)
    default:
      return state
  }
}

const sharesById = shares =>
  shares.reduce((map, share) => map.set(share.get('id'), share), Map())

const shares = (state = Map(), action) => {
  switch (action.type) {
    case WISH_LIST_SHARED: {
      state = state.filter(
        share => !action.removedShares.includes(share.get('id'))
      )
      return state.merge(sharesById(action.shares))
    }
    case GET_PERSONAL_WISH_LISTS_SUCCESS:
    case WISH_LIST_SHARE_FETCHED:
      return state.merge(sharesById(action.shares))
    case GRANT_WISH:
    case REVOKE_WISH:
      return state.set(action.share.get('id'), action.share)
    default:
      return state
  }
}

export default combineReducers({
  lists,
  wishes,
  shares
})
