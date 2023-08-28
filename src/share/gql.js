import { gql } from '@apollo/client'
import {
  DEFAULT_WISH_PROPERITES,
  MINIMUM_WISHLIST_PROPERITES
} from '../lists/fragments'
import { DEFAULT_SHARE_PROPERITES } from './fragments'

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

export const GET_SHARE = gql`
  ${DEFAULT_SHARE_PROPERITES}
  ${MINIMUM_WISHLIST_PROPERITES}
  ${DEFAULT_WISH_PROPERITES}
  query getShare($id: String!) {
    share: getShare(id: $id) {
      ...DefaultShareProperties
      wishList {
        ...MinimumWishListProperties
        wishes {
          ...DefaultWishProperties
        }
        shares {
          ...DefaultShareProperties
        }
      }
    }
  }
`

export const CLAIM_WISH = gql`
  mutation claimWish($id: String!, $wishId: String!) {
    share: claimWish(id: $id, wishId: $wishId) {
      id
      claimedWishIds
    }
  }
`

export const REMOVE_WISH_CLAIM = gql`
  mutation removeWishClaim($id: String!, $wishId: String!) {
    share: removeWishClaim(id: $id, wishId: $wishId) {
      id
      claimedWishIds
    }
  }
`
