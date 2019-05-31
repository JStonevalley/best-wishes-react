import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { Route, Link } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import { Map } from 'immutable'
import { Fab } from '@material-ui/core'
import { PageHeading, Paper } from '../../shared/ui'
import ShareIcon from '@material-ui/icons/Share'
import AddIcon from '@material-ui/icons/Add'
import { getPersonalWishLists } from '../actions'
import { Wish } from './Wish'
import { WishForm } from './WishForm'
import { ShareWishList } from './ShareWishList.jsx'

const styles = theme => ({
  wishLine: {
    display: 'flex',
    alignItems: 'center'
  },
  textField: {
    flexGrow: 1
  },
  standardSpace: {
    margin: `${theme.spacing.unit}px`
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1
  },
  list: {
    display: 'flex',
    flexDirection: 'column'
  },
  wishPaper: {
    margin: `${theme.spacing.unit}px`,
    padding: `${3 * theme.spacing.unit}px`
  },
  shareFabRoot: {
    position: 'fixed',
    right: `${3 * theme.spacing.unit}px`,
    bottom: `${13 * theme.spacing.unit}px`
  },
  addWishFabRoot: {
    position: 'fixed',
    right: `${3 * theme.spacing.unit}px`,
    bottom: `${3 * theme.spacing.unit}px`
  }
})

export const WishList = compose(
  withStyles(styles),
  connect((state, { match: { params: { wishListId } } }) => {
    const username = state.user.cognito && state.user.cognito.username
    const wishList = state.workshop.lists.get(wishListId)
    const activeWishList =
      wishList && wishList.get('owner') === username ? wishList : null
    return {
      wishList: activeWishList,
      wishes: activeWishList
        ? state.workshop.wishes.filter(
          wish => wish.get('wishList') === activeWishList.get('id')
        )
        : Map()
    }
  })
)(
  ({
    wishList,
    wishes,
    classes,
    dispatch,
    match: {
      path,
      url,
      params: { wishListId }
    }
  }) => {
    useEffect(
      () => {
        dispatch(getPersonalWishLists())
      },
      [wishListId]
    )
    if (!wishList) return null
    return (
      <div>
        <div>
          <PageHeading heading={wishList.get('title')} />
          <Route
            path={`${path}/:wishId`}
            render={props => (
              <WishForm
                wishListId={wishList.get('id')}
                wish={wishes.get(props.match.params.wishId)}
                {...props}
              />
            )}
          />
          <div className={classes.list}>
            {wishes
              .map(wish => (
                <Paper
                  className={classes.wishPaper}
                  key={wish.get('id') || 'newWish'}
                >
                  <Route
                    path={path}
                    render={props => <Wish wish={wish} {...props} />}
                  />
                </Paper>
              ))
              .toArray()}
          </div>
        </div>
        <ShareWishList
          wishList={wishList}
          buttonElement={
            <Fab
              classes={{ root: classes.shareFabRoot }}
              variant='round'
              color='primary'
            >
              <ShareIcon />
            </Fab>
          }
        />
        <Link to={`${url}/null`}>
          <Fab
            classes={{ root: classes.addWishFabRoot }}
            variant={wishes.isEmpty() ? 'extended' : 'round'}
          >
            <AddIcon />
            {wishes.isEmpty() && 'Make your first wish'}
          </Fab>
        </Link>
      </div>
    )
  }
)
