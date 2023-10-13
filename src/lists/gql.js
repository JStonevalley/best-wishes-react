import { gql } from '@apollo/client'
import { DEFAULT_WISH_PROPERITES, MINIMUM_WISHLIST_PROPERITES } from './fragments'
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

export const CREATE_WISH_LIST = gql`
  ${MINIMUM_WISHLIST_PROPERITES}
  mutation createWishList($headline: String!) {
    wishList: createWishList(headline: $headline) {
      ...MinimumWishListProperties
    }
  }
`

export const CHANGE_WISH_LIST = gql`
  mutation changeWishList($id: String!, $headline: String!) {
    wishList: changeWishList(id: $id, headline: $headline) {
      id
      headline
    }
  }
`

export const ARCHIVE_WISH_LIST = gql`
  mutation archiveWishList($id: String!) {
    wishList: archiveWishList(id: $id) {
      id
      archivedAt
    }
  }
`

export const UNARCHIVE_WISH_LIST = gql`
  mutation unarchiveWishList($id: String!) {
    wishList: unarchiveWishList(id: $id) {
      id
      archivedAt
    }
  }
`

export const UPDATE_WISH_ORDER_FOR_WISH_LIST = gql`
  mutation updateWishOrderForWishList($id: String!, $wishOrder: [String!]!) {
    wishList: updateWishOrderForWishList(id: $id, wishOrder: $wishOrder) {
      id
      wishOrder
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
    wish: changeWish(id: $id, link: $link, title: $title, description: $description, image: $image, quantity: $quantity, price: $price) {
      ...DefaultWishProperties
    }
  }
`

export const REMOVE_A_WISH = gql`
  mutation removeAWish($id: String!) {
    id: removeAWish(id: $id)
  }
`
