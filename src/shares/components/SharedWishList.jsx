import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { fetchWishListShare } from '../actions'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { SharedWish } from '../../workshop/components/Wish'

export const SharedWishList = connect(
  (
    state,
    {
      match: {
        params: { shareId }
      }
    }
  ) => {
    const share = state.workshop.shares.get(shareId)
    const wishList = share
      ? state.workshop.lists.get(share.get('wishList'))
      : undefined
    const wishes = wishList
      ? state.workshop.wishes.filter(
        wish => wish.get('wishList') === wishList.get('id')
      )
      : undefined
    const shares = share
      ? state.workshop.shares.filter(
        share => share.get('wishList') === wishList.get('id')
      )
      : undefined
    return {
      wishList,
      wishes,
      shares
    }
  }
)(({ dispatch, wishList, wishes, shares, match: { params: { shareId } } }) => {
  useEffect(
    () => {
      dispatch(fetchWishListShare(shareId))
    },
    [shareId]
  )
  if (!shares) return null
  return (
    <div>
      <Typography variant='h1'>{wishList.get('title')}</Typography>
      <Typography variant='subtitle1'>{wishList.get('owner')}</Typography>
      {wishes
        .map(wish => (
          <Paper key={wish.get('id')}>
            <SharedWish
              wish={wish}
              shares={shares.filter(share =>
                share.get('grantedWishes').includes(wish.get('id'))
              )}
              activeShare={shares.find(share => share.get('id') === shareId)}
            />
          </Paper>
        ))
        .toArray()}
    </div>
  )
})
