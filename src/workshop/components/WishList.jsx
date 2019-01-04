import React from 'react'
import { connect } from 'react-redux'
import { compose, branch, renderNothing } from 'recompose'
import { Route, Switch, Link } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import { Map, fromJS } from 'immutable'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'
import { ADD_NEW_WISH } from '../actions'
import { Wish } from './Wish'
import { WishForm } from './WishForm'

const styles = (theme) => ({
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
  divider: {
    width: '80%',
    alignSelf: 'center'
  },
  newWishButton: {
    textDecoration: 'none',
    alignSelf: 'center'
  }
})

export const WishList = compose(
  withStyles(styles),
  connect(
    (state, { match: { params: { wishListId } } }) => {
      const activeWishList = state.wishLists.lists.get(wishListId)
      return {
        wishList: activeWishList,
        activeWishId: state.wishLists.activeWish,
        wishes: activeWishList ? state.wishLists.wishes.filter((wish) => wish.wishList === activeWishList.id) : Map()
      }
    }
  ),
  branch(
    ({ wishList }) => !wishList,
    renderNothing
  )
)(({ wishList, wishes, classes, activeWishId, style, dispatch, match: { path, url } }) => {
  const newWishExists = wishes.find((wish) => !wish.get('id'))
  return <Card style={{ margin: '1rem', ...style }}>
    <CardContent>
      <Typography
        variant='h5'
        component='h2'
      >
        {wishList.get('title')}
      </Typography>
      <div className={classes.list}>
        {wishes.map((wish, index) => <React.Fragment key={wish.get('id') || 'newWish'}>
          <Switch>
            <Route
              path={`${path}/${wish.get('id')}`}
              render={(props) => <WishForm
                wishListId={wishList.get('id')}
                wish={wish}
                {...props}
              />}
            />
            <Route
              path={path}
              render={(props) => <Wish
                wish={wish}
                {...props}
              />}
            />
          </Switch>
          {index < wishes.length - 1 && <Divider className={classes.divider} />}
        </React.Fragment>).toArray()}
        {!newWishExists && <Link
          to={`${url}/null`}
          className={classes.newWishButton}
        >
          <Button
            color='primary'
            onClick={() => {
              dispatch({ type: ADD_NEW_WISH, wish: fromJS({ id: null, wishList: wishList.get('id') }) })
            }}
          >
            Make a new wish
          </Button>
        </Link>}
      </div>
    </CardContent>
  </Card>
})
