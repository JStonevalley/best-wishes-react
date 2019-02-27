import Amplify, { Auth } from 'aws-amplify'
import awsmobile from '../aws-exports'
Amplify.configure(awsmobile)

export const signIn = ({ email, password }) => {
  return async dispatch => {
    try {
      const user = await Auth.signIn(email, password)
      const currentUser = await Auth.currentAuthenticatedUser()
      console.log(user, currentUser)
    } catch (error) {
      console.error(error)
    }
  }
}

export const signUp = ({ email, password }) => {
  return async dispatch => {
    try {
      const user = await Auth.signUp({
        username: email,
        password,
        attributes: { email }
      })
      console.log(user)
    } catch (error) {
      console.error(error)
    }
  }
}
