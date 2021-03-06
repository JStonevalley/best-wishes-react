import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withStyles } from '@material-ui/core'
import { fetchWishListShare } from '../actions'
import { Paper } from '../../shared/ui'
import Typography from '@material-ui/core/Typography'
import { SharedWish } from '../../workshop/components/Wish'

const style = (theme) => ({
  base: {
    padding: '1rem 0'
  },
  list: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  wishPaper: {
    margin: `${theme.spacing.unit}px`,
    padding: `${3 * theme.spacing.unit}px`,
    display: 'flex',
    flex: '1 0 15rem',
    maxWidth: '20rem',
    flexGrow: 1
  }
})

export const SharedWishList = compose(
  withStyles(style),
  connect((state, { match: { params: { shareId } } }) => {
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
  })
)(
  ({
    classes,
    dispatch,
    wishList,
    wishes,
    shares,
    match: {
      params: { shareId }
    }
  }) => {
    useEffect(
      () => {
        dispatch(fetchWishListShare(shareId))
      },
      [shareId]
    )
    if (!shares) return null
    return (
      <div className={classes.base}>
        <Typography align='center' variant='h4' component='h1'>
          {wishList.get('title')}
        </Typography>
        <Typography align='center' variant='subtitle1'>
          {wishList.get('owner')}
        </Typography>
        <div className={classes.list}>
          {wishes
            .map(wish => (
              <Paper className={classes.wishPaper} key={wish.get('id')}>
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
      </div>
    )
  }
)
