import React from 'react'
import { useQuery } from '@apollo/client'
import { GET_OWN_WISH_LISTS } from '../gql'
import { WishListListItem } from './WishListsPresentation'
import { Paper, Typography, List, Divider } from '@mui/material'

export const OwnerLists = ({ wishLists, shares }) => {
  const { data: wishListsData } = useQuery(GET_OWN_WISH_LISTS)
  return (
    <Paper sx={{ padding: 2 }}>
      <Typography
        component='h1'
        variant='h4'
        sx={{ marginTop: 3, marginLeft: 3, marginRight: 3 }}
      >
        My lists
      </Typography>
      {wishListsData?.wishLists && (
        <List>
          {wishListsData.wishLists.map((wishList) => (
            <WishListListItem key={wishList.id} wishList={wishList} />
          ))}
          <Divider variant='inset' component='li' />
        </List>
      )}
    </Paper>
  )
}
