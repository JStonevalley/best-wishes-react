import { gql } from '@apollo/client'

export const DEFAULT_SHARE_PROPERITES = gql`
  fragment DefaultShareProperties on Share {
    id
    invitedEmail
  }
`

export const CREATE_SHARE = gql`
  ${DEFAULT_SHARE_PROPERITES}
  mutation createShare($invitedEmail: String!, $wishListId: String!) {
    share: createShare(invitedEmail: $invitedEmail, wishListId: $wishListId) {
      ...DefaultShareProperties
    }
  }
`

export const REMOVE_SHARE = gql`
  mutation removeShare($id: String!) {
    share: removeShare(id: $id) {
      id
    }
  }
`
