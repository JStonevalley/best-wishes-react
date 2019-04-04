import { fromJS } from 'immutable'
import * as queryString from 'qs'
import { bwFetch } from '../shared/actions'

const GET_PERSONAL_WISH_LISTS_LOADING = 'GET_PERSONAL_WISH_LISTS_LOADING'
export const GET_PERSONAL_WISH_LISTS_SUCCESS = 'GET_PERSONAL_WISH_LISTS_SUCCESS'

export const getPersonalWishLists = () => {
  return async dispatch => {
    dispatch({ type: GET_PERSONAL_WISH_LISTS_LOADING })
    const { wishes, wishLists, shares } = await bwFetch(
      `private/wish-list?${queryString.stringify({
        withWishes: true,
        withShares: true
      })}`
    )

    dispatch({
      type: GET_PERSONAL_WISH_LISTS_SUCCESS,
      wishLists: fromJS(wishLists),
      wishes: fromJS(wishes),
      shares: fromJS(shares)
    })
  }
}

export const CREATE_WISH_LIST = 'CREATE_WISH_LIST'

export const createWishList = ({ title }) => {
  return async dispatch => {
    try {
      const savedWishList = await bwFetch('private/wish-list', {
        method: 'POST',
        body: JSON.stringify({
          title
        })
      })
      dispatch({ type: CREATE_WISH_LIST, wishList: fromJS(savedWishList) })
      return savedWishList
    } catch (error) {
      console.error(error)
    }
  }
}

export const WISH_DELETED = 'WISH_DELETED'

export const deleteWish = id => {
  return async dispatch => {
    try {
      await bwFetch(`private/wish/${id}`, {
        method: 'DELETE'
      })
      dispatch({ type: WISH_DELETED, id })
    } catch (error) {
      console.error(error)
    }
  }
}

export const WISH_SAVED = 'WISH_SAVED'
export const ADD_NEW_WISH = 'ADD_NEW_WISH'

export const saveWish = wish => {
  return async dispatch => {
    try {
      const savedWish = await bwFetch('private/wish', {
        method: 'PUT',
        body: JSON.stringify(wish)
      })
      dispatch({ type: WISH_SAVED, wish: fromJS(savedWish) })
    } catch (error) {
      console.error(error)
    }
  }
}

export const WISH_LIST_SHARED = 'WISH_LIST_SHARED'

export const shareWishList = ({ id, sharedTo }) => {
  return async dispatch => {
    const shares = await bwFetch(`private/wish-list/share/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ sharedTo })
    })
    dispatch({ type: WISH_LIST_SHARED, shares: fromJS(shares) })
  }
}
