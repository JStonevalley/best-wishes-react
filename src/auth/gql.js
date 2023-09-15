import { gql } from '@apollo/client'

export const MINIMUM_USER_PROPERITES = gql`
  fragment MinimumUserProperties on User {
    id
    googleUserId
    email
  }
`

export const GET_CURRENT_USER = gql`
  ${MINIMUM_USER_PROPERITES}
  query getCurrentUser {
    user: getCurrentUser {
      ...MinimumUserProperties
    }
  }
`

export const CREATE_USER = gql`
  ${MINIMUM_USER_PROPERITES}
  mutation createUser($email: String!) {
    user: createUser(email: $email) {
      ...MinimumUserProperties
    }
  }
`
