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
