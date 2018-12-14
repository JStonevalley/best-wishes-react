import React from 'react'
import { connect } from 'react-redux'
import { compose, branch, renderNothing } from 'recompose'
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
import { activeWishListSelector } from '../selectors'

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
  }
})

export const WishList = compose(
  withStyles(styles),
  connect(
    (state) => {
      const activeWishList = activeWishListSelector(state)
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
)(({ wishList, wishes, classes, activeWishId, style, dispatch }) => {
  const newWishExists = wishes.find((wish) => !wish.get('id'))
  return <Card style={style}>
    <CardContent>
      <Typography
        variant='h5'
        component='h2'
      >
        {wishList.get('title')}
      </Typography>
      <div className={classes.list}>
        {wishes.map((wish, index) => <React.Fragment key={wish.get('id') || 'newWish'}>
          {activeWishId === wish.get('id')
            ? <WishForm
              wishListId={wishList.get('id')}
              wish={wish}
            />
            : <Wish
              wish={wish}
            />}
          {index < wishes.length - 1 && <Divider className={classes.divider} />}
        </React.Fragment>).toArray()}
        {!newWishExists && <Button
          color='primary'
          onClick={() => {
            dispatch({ type: ADD_NEW_WISH, wish: fromJS({ id: null, wishList: wishList.get('id') }) })
          }}
        >
          Make a new wish
        </Button>}
      </div>
    </CardContent>
  </Card>
})
