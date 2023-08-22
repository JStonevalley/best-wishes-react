import { gql } from '@apollo/client'

export const MINIMUM_WISHLIST_PROPERITES = gql`
  fragment MinimumWishListProperties on WishList {
    id
    headline
  }
`

export const DEFAULT_WISH_PROPERITES = gql`
  fragment DefaultWishProperties on Wish {
    id
    title
    description
    image
    link
    quantity
    price {
      amount
      currency
    }
  }
`
