import { fromJS } from 'immutable'
import * as queryString from 'qs'
import { bwFetch } from '../shared/rest'

const GET_PERSONAL_WISH_LISTS_LOADING = 'GET_PERSONAL_WISH_LISTS_LOADING'
export const GET_PERSONAL_WISH_LISTS_SUCCESS = 'GET_PERSONAL_WISH_LISTS_SUCCESS'

export const getPersonalWishLists = () => {
  return async (dispatch, getState) => {
    dispatch({ type: GET_PERSONAL_WISH_LISTS_LOADING })
    const { wishes, wishLists } = await bwFetch(
      `wish-list?${queryString.stringify({ email: getState().shared.user.get('email'), withWishes: true })}`
    )

    dispatch({
      type: GET_PERSONAL_WISH_LISTS_SUCCESS,
      wishLists: fromJS(wishLists),
      wishes: fromJS(wishes)
    })
  }
}

export const CREATE_WISH_LIST = 'CREATE_WISH_LIST'

export const createWishList = ({ title }) => {
  return async (dispatch, getState) => {
    try {
      const savedWishList = await bwFetch(
        'wish-list',
        {
          method: 'PUT',
          body: JSON.stringify({
            title,
            owner: getState().shared.user.get('email')
          })
        }
      )
      dispatch({ type: CREATE_WISH_LIST, wishList: fromJS(savedWishList) })
      return savedWishList
    } catch (error) {
      console.error(error)
    }
  }
}

export const WISH_DELETED = 'WISH_DELETED'

export const deleteWish = (id) => {
  return async (dispatch) => {
    try {
      await bwFetch(
        `wish/${id}`,
        {
          method: 'DELETE'
        }
      )
      dispatch({ type: WISH_DELETED, id })
    } catch (error) {
      console.error(error)
    }
  }
}

export const WISH_SAVED = 'WISH_SAVED'
export const ADD_NEW_WISH = 'ADD_NEW_WISH'

export const saveWish = (wish) => {
  return async (dispatch) => {
    try {
      const savedWish = await bwFetch(
        'wish',
        {
          method: 'PUT',
          body: JSON.stringify(wish)
        }
      )
      dispatch({ type: WISH_SAVED, wish: fromJS(savedWish) })
    } catch (error) {
      console.error(error)
    }
  }
}
