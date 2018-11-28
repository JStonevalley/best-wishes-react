import React from 'react'
import { connect } from 'react-redux'
import { compose, branch, renderNothing } from 'recompose'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
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
        wishList: activeWishList ? activeWishList.toJS() : undefined,
        activeWish: state.wishLists.activeWish
      }
    }
  ),
  branch(
    ({ wishList }) => !wishList,
    renderNothing
  )
)(({ wishList, classes, activeWish, style }) => {
  return <Card style={style}>
    <CardContent>
      <Typography
        variant='h5'
        component='h2'
      >
        {wishList.title}
      </Typography>
      <div className={classes.list}>
        {wishList.wishes.map((wish, index) => <React.Fragment key={wish.title}>
          {activeWish === wish.id ? <WishForm wish={wish} /> : <Wish wish={wish} />}
          {index < wishList.wishes.length - 1 && <Divider className={classes.divider} />}
        </React.Fragment>)}
      </div>
    </CardContent>
  </Card>
})
