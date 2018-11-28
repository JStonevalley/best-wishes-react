/* global fetch */
import { fromJS } from 'immutable'

const GET_PERSONAL_WISH_LISTS_LOADING = 'GET_PERSONAL_WISH_LISTS_LOADING'
export const GET_PERSONAL_WISH_LISTS_SUCCESS = 'GET_PERSONAL_WISH_LISTS_SUCCESS'

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

export const getPersonalWishLists = () => {
  return async (dispatch) => {
    dispatch({ type: GET_PERSONAL_WISH_LISTS_LOADING })
    await sleep(1000)
    dispatch({
      type: GET_PERSONAL_WISH_LISTS_SUCCESS,
      wishLists: fromJS({
        '0000000001': {
          id: '0000000001',
          title: 'First List',
          wishes: [
            {
              id: '0000000011',
              title: 'First wish of first list!',
              body: 'First body of first wish in first list.',
              link: 'https://sellpy.se',
              image: 'https://www.mobil.se/sites/mobil.se/files/styles/retina/public/_dsc9794.jpg?itok=wGKPAwpl'
            },
            {
              id: '0000000012',
              title: 'Second wish of first list!'
            }
          ]
        },
        '0000000002': {
          id: '0000000002',
          title: 'Second List',
          wishes: [
            {
              id: '0000000021',
              title: 'First wish of second list!'
            }
          ]
        }
      })
    })
  }
}

export const CREATE_WISH_LIST = 'CREATE_WISH_LIST'

export const createWishList = ({ title }) => {
  return async (dispatch, getState) => {
    try {
      const savedWishList = fromJS(await (await fetch(
        'http://localhost:3001/wish-list',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title,
            owner: getState().shared.user.get('email'),
            wishes: []
          })
        }
      )).json())
      console.log('response', savedWishList)
      dispatch({ type: CREATE_WISH_LIST, wishList: savedWishList })
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

export const saveWish = console.log
