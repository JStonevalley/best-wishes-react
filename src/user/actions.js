import { fromJS } from 'immutable'
import Amplify, { Auth } from 'aws-amplify'
import awsmobile from '../aws-exports'
Amplify.configure(awsmobile)

export const SIGN_IN = 'SIGN_IN'

export const signIn = ({ email, password }) => {
  return async dispatch => {
    try {
      dispatch({
        type: SIGN_IN,
        user: fromJS(await Auth.signIn(email, password))
      })
      return '/workshop'
    } catch (error) {
      console.error(error)
    }
  }
}

export const signUp = ({ email, password }) => {
  return async dispatch => {
    try {
      await Auth.signUp({
        username: email,
        password,
        attributes: { email }
      })
      return '/confirm-sign-up'
    } catch (error) {
      console.error(error)
    }
  }
}

export const SIGN_UP = 'SIGN_UP'

export const confirmSignUp = ({ email, code }) => {
  return async dispatch => {
    try {
      await Auth.confirmSignUp(email, code)
      dispatch({
        type: SIGN_UP,
        user: fromJS(await Auth.currentAuthenticatedUser())
      })
      return '/workshop'
    } catch (error) {
      console.error(error)
    }
  }
}

export const isLoggedIn = () => {
  return async dispatch => {
    try {
      dispatch({
        type: SIGN_IN,
        user: fromJS(await Auth.currentAuthenticatedUser())
      })
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }
}
