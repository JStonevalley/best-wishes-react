import React from 'react'
import { useQuery } from '@apollo/client'
import WishListsPresentation from '../lists/components/WishListsPresentation'
import { GET_OWN_SHARES } from './gql'

export const OwnerShares = ({ wishLists, shares }) => {
  const { data: sharesData } = useQuery(GET_OWN_SHARES)
  return (
    <WishListsPresentation title='Shared with me' shares={sharesData?.shares} />
  )
}
