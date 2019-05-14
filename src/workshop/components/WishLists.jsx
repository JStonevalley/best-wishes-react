import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ReceiptIcon from '@material-ui/icons/Receipt'
import AddIcon from '@material-ui/icons/Add'
import { Field } from 'react-final-form'
import { PageHeading, ActionFormDialog } from '../../shared/ui'
import { withStyles } from '@material-ui/core/styles'
import { ShareWishList } from './ShareWishList.jsx'
import { RegularTextField } from '../../shared/FormFields'
import { getPersonalWishLists, createWishList } from '../actions'
import { required } from '../../shared/FormValidators'

const styles = {
  wrapper: {
    display: 'flex',
    justifyContent: 'center'
  },
  base: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    maxWidth: '40rem'
  },
  flexGrow: {
    flexGrow: 1
  }
}

export const WishLists = withStyles(styles)(({ history, classes }) => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getPersonalWishLists())
  }, [])
  const wishLists = useSelector(state => state.workshop.lists)
  const navigateToWishList = wishListId =>
    history.push(`/workshop/wish-list/${wishListId}`)
  return (
    <div className={classes.wrapper}>
      <div className={classes.base}>
        <PageHeading heading='My wish lists' />
        <List>
          {wishLists
            .map((wishList, key) => (
              <ListItem
                key={key}
                button
                onClick={() => navigateToWishList(key)}
              >
                <ListItemIcon>
                  <ReceiptIcon />
                </ListItemIcon>
                <ListItemText primary={wishList.get('title')} />
                <ListItemSecondaryAction>
                  <ShareWishList wishList={wishList} />
                </ListItemSecondaryAction>
              </ListItem>
            ))
            .toList()}
        </List>
        <ActionFormDialog
          color='primary'
          title='Create new wishlist'
          submitButtonText='Create'
          actionButtonIcon={AddIcon}
          actionButtonText='New wishlist'
          onSubmit={async data => {
            const { id } = await dispatch(createWishList(data))
            navigateToWishList(id)
          }}
        >
          <Field
            name='title'
            component={RegularTextField}
            label='Title'
            validate={required}
            margin='none'
            variant='outlined'
            className={classes.flexGrow}
          />
        </ActionFormDialog>
      </div>
    </div>
  )
})
