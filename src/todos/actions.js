/* global fetch */
import { fromJS } from 'immutable'
import * as queryString from 'qs'

const GET_PERSONAL_WISH_LISTS_LOADING = 'GET_PERSONAL_WISH_LISTS_LOADING'
export const GET_PERSONAL_WISH_LISTS_SUCCESS = 'GET_PERSONAL_WISH_LISTS_SUCCESS'

export const getPersonalWishLists = () => {
  return async (dispatch, getState) => {
    dispatch({ type: GET_PERSONAL_WISH_LISTS_LOADING })
    const { wishes, wishLists } = await (await fetch(
      `http://localhost:3001/wish-list?${queryString.stringify({ email: getState().shared.user.get('email'), withWishes: true })}`
    )).json()

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
      const savedWishList = await (await fetch(
        'http://localhost:3001/wish-list',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title,
            owner: getState().shared.user.get('email')
          })
        }
      )).json()
      dispatch({ type: CREATE_WISH_LIST, wishList: fromJS(savedWishList) })
    } catch (error) {
      console.error(error)
    }
  }
}

export const SET_ACTIVE_LIST = 'SET_ACTIVE_LIST'

export const setActiveList = (listId) => {
  return { type: SET_ACTIVE_LIST, listId }
}

export const SET_ACTIVE_WISH = 'SET_ACTIVE_WISH'

export const setActiveWish = (wishId) => {
  return { type: SET_ACTIVE_WISH, wishId }
}

export const SAVE_WISH = 'SAVE_WISH'
export const ADD_NEW_WISH = 'ADD_NEW_WISH'

export const saveWish = (wish) => {
  console.log(wish)
  return async (dispatch) => {
    try {
      const savedWish = await (await fetch(
        'http://localhost:3001/wish',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(wish)
        }
      )).json()
      dispatch({ type: SAVE_WISH, wish: fromJS(savedWish) })
    } catch (error) {
      console.error(error)
    }
  }
}
