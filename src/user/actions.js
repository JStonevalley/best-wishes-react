import { fromJS } from 'immutable'
import Amplify, { Auth } from 'aws-amplify'
import awsmobile from '../aws-exports'
Amplify.configure(awsmobile)

export const SIGN_IN = 'SIGN_IN'

export const signIn = ({ email, password }) => {
  return async dispatch => {
    dispatch({
      type: SIGN_IN,
      user: fromJS(await Auth.signIn(email, password))
    })
    lastSignupDetails = null
    return '/workshop'
  }
}

let lastSignupDetails

export const signUp = ({ email, password }) => {
  return async dispatch => {
    await Auth.signUp({
      username: email,
      password,
      attributes: { email }
    })
    lastSignupDetails = { email, password }
    return {
      pathname: '/confirm-sign-up',
      state: { email }
    }
  }
}

export const resendSignUp = email =>
  Auth.resendSignUp(email)
    .then(console.log)
    .catch(console.error)

export const SIGN_UP = 'SIGN_UP'

export const confirmSignUp = ({ email, code }) => {
  return async dispatch => {
    await Auth.confirmSignUp(email, code)
    if (lastSignupDetails) {
      return dispatch(signIn(lastSignupDetails))
    } else {
      return '/sign-in'
    }
  }
}

export const isSignedIn = () => {
  return async dispatch => {
    try {
      dispatch({
        type: SIGN_IN,
        user: fromJS(await Auth.currentAuthenticatedUser())
      })
      return true
    } catch (error) {
      console.error(error)
      dispatch({
        type: SIGN_IN
      })
      return false
    }
  }
}

export const signOut = async () => {
  await Auth.signOut()
  window.location.replace(window.location.origin)
}
