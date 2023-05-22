import { gql } from '@apollo/client'

export const MINIMUM_WISHLIST_PROPERITES = gql`
  fragment MinimumWishListProperties on WishList {
    id
    headline
    user {
      id
    }
  }
`

export const GET_OWN_WISH_LISTS = gql`
  ${MINIMUM_WISHLIST_PROPERITES}
  query getOwnWishLists {
    wishLists: getOwnWishLists {
      ...MinimumWishListProperties
    }
  }
`
