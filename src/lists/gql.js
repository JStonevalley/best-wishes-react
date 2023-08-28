import { gql } from '@apollo/client'
import {
  DEFAULT_WISH_PROPERITES,
  MINIMUM_WISHLIST_PROPERITES
} from './fragments'
import { DEFAULT_SHARE_PROPERITES } from '../share/fragments'

export const GET_OWN_WISH_LISTS = gql`
  ${MINIMUM_WISHLIST_PROPERITES}
  query getOwnWishLists {
    wishLists: getOwnWishLists {
      ...MinimumWishListProperties
      wishes {
        image
      }
    }
  }
`

export const GET_OWN_WISH_LIST = gql`
  ${MINIMUM_WISHLIST_PROPERITES}
  ${DEFAULT_WISH_PROPERITES}
  ${DEFAULT_SHARE_PROPERITES}
  query getOwnWishList($id: String!) {
    wishList: getOwnWishList(id: $id) {
      ...MinimumWishListProperties
      wishes {
        ...DefaultWishProperties
      }
      shares {
        ...DefaultShareProperties
      }
    }
  }
`

export const MAKE_A_WISH = gql`
  ${DEFAULT_WISH_PROPERITES}
  mutation makeAWish(
    $wishListId: String!
    $link: String
    $title: String!
    $description: String
    $image: String
    $quantity: Int
    $price: ValueObjectInput
  ) {
    wish: createWish(
      wishListId: $wishListId
      link: $link
      title: $title
      description: $description
      image: $image
      quantity: $quantity
      price: $price
    ) {
      ...DefaultWishProperties
    }
  }
`

export const CHANGE_A_WISH = gql`
  ${DEFAULT_WISH_PROPERITES}
  mutation changeAWish(
    $id: String!
    $link: String
    $title: String!
    $description: String
    $image: String
    $quantity: Int
    $price: ValueObjectInput
  ) {
    wish: changeWish(
      id: $id
      link: $link
      title: $title
      description: $description
      image: $image
      quantity: $quantity
      price: $price
    ) {
      ...DefaultWishProperties
    }
  }
`

export const REMOVE_A_WISH = gql`
  mutation removeAWish($id: String!) {
    id: removeAWish(id: $id)
  }
`
