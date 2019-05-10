import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { Route, Switch, Link } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import { Map, fromJS } from 'immutable'
import { PageHeading, Paper } from '../../shared/ui'
import Button from '@material-ui/core/Button'
import { ADD_NEW_WISH, getPersonalWishLists } from '../actions'
import { Wish } from './Wish'
import { WishForm } from './WishForm'

const styles = theme => ({
  wishLine: {
    display: 'flex',
    alignItems: 'center'
  },
  textField: {
    flexGrow: 1
  },
  standardSpace: {
    margin: theme.spacing.unit
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
    margin: '1rem'
  },
  newWishButton: {
    textDecoration: 'none',
    alignSelf: 'center'
  }
})

export const WishList = compose(
  withStyles(styles),
  connect((state, { match: { params: { wishListId } } }) => {
    const activeWishList = state.workshop.lists.get(wishListId)
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
    const newWishExists = wishes.find(wish => !wish.get('id'))
    return (
      <div>
        <div>
          <PageHeading heading={wishList.get('title')} />
          <div className={classes.list}>
            {wishes
              .map(wish => (
                <Paper
                  className={classes.wishPaper}
                  key={wish.get('id') || 'newWish'}
                >
                  <Switch>
                    <Route
                      path={`${path}/${wish.get('id')}`}
                      render={props => (
                        <WishForm
                          wishListId={wishList.get('id')}
                          wish={wish}
                          {...props}
                        />
                      )}
                    />
                    <Route
                      path={path}
                      render={props => <Wish wish={wish} {...props} />}
                    />
                  </Switch>
                </Paper>
              ))
              .toArray()}
            {!newWishExists && (
              <Link to={`${url}/null`} className={classes.newWishButton}>
                <Button
                  color='primary'
                  onClick={() => {
                    dispatch({
                      type: ADD_NEW_WISH,
                      wish: fromJS({ id: null, wishList: wishList.get('id') })
                    })
                  }}
                >
                  Make a new wish
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    )
  }
)
