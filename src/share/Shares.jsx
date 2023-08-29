import React from 'react'
import { useQuery } from '@apollo/client'
import { WishListListItem } from '../lists/components/WishListsPresentation'
import { GET_OWN_SHARES } from './gql'
import { Paper, Typography, List, Divider } from '@mui/material'

export const OwnerShares = ({ wishLists, shares }) => {
  const { data: sharesData } = useQuery(GET_OWN_SHARES)
  return (
    <Paper sx={{ padding: 2 }}>
      <Typography
        component='h1'
        variant='h4'
        sx={{ marginTop: 3, marginLeft: 3, marginRight: 3 }}
      >
        Shared with me
      </Typography>
      {sharesData?.shares && (
        <List>
          {sharesData.shares.map(({ id: shareId, wishList }) => (
            <WishListListItem
              key={shareId}
              shareId={shareId}
              wishList={wishList}
            />
          ))}
          <Divider variant='inset' component='li' />
        </List>
      )}
    </Paper>
  )
}
