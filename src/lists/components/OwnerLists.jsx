import React from 'react'
import { useQuery } from '@apollo/client'
import { GET_OWN_WISH_LISTS } from '../gql'
import WishListsPresentation from './WishListsPresentation'

export const OwnerLists = ({ wishLists, shares }) => {
  const { data: wishListsData } = useQuery(GET_OWN_WISH_LISTS)
  return (
    <WishListsPresentation
      title='My lists'
      wishLists={wishListsData?.wishLists}
    />
  )
}
