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

export const GET_OWN_WISH_LISTS = gql`
  ${MINIMUM_WISHLIST_PROPERITES}
  query getOwnWishLists {
    wishLists: getOwnWishLists {
      ...MinimumWishListProperties
    }
  }
`

export const GET_OWN_WISH_LIST = gql`
  ${MINIMUM_WISHLIST_PROPERITES}
  ${DEFAULT_WISH_PROPERITES}
  query getOwnWishList($id: String!) {
    wishList: getOwnWishList(id: $id) {
      ...MinimumWishListProperties
      wishes {
        ...DefaultWishProperties
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
