export const USER_SIGNED_IN = 'USER_SIGNED_IN'

export const signIn = ({ email }) => {
  return { type: USER_SIGNED_IN, user: email }
}
