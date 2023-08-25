import { gql } from '@apollo/client'

export const DEFAULT_SHARE_PROPERITES = gql`
  fragment DefaultShareProperties on Share {
    id
    invitedEmail
    claimedWishIds
  }
`
