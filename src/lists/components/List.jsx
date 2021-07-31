import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  List as MaterialList,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  ListItemAvatar,
  Avatar,
  Divider,
  Typography,
  Paper,
  Button,
  IconButton
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import ShareIcon from '@material-ui/icons/Share'
import { useLists } from '../../store/lists'
import { pick, prop } from 'ramda'
import WishFormModal from './WishForm'
import { useForm } from 'react-hook-form'
import { useUser } from '../../store/user'
import { Lightbox } from '../../ui/components/Lightbox.jsx'

const useWishListHeaderStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'space-between'
  }
}))

const ListHeader = ({ headline, listId }) => {
  const classes = useWishListHeaderStyles()
  return (
    <div className={classes.container}>
      <Typography component='h1' variant='h4'>
        {headline}
      </Typography>
      <IconButton aria-label='share'>
        <ShareIcon />
      </IconButton>
    </div>
  )
}

const useWishListStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2, 2)
  },
  inline: {
    display: 'inline'
  }
}))

const List = ({
  match: {
    params: { listId }
  }
}) => {
  const [wishFormIsOpen, setWishFormIsOpen] = useState(false)
  const [formWishId, setFormWishId] = useState()
  const user = useUser()
  const hookFormProps = useForm()
  const editWish = (id, wish) => {
    setFormWishId(id)
    hookFormProps.reset(
      wish
        ? wish
        : {
            link: undefined,
            title: undefined,
            description: undefined,
            price: undefined,
            image: undefined,
            ownerUID: user.uid
          },
      {
        keepValues: false
      }
    )
    setWishFormIsOpen(true)
  }
  const classes = useWishListStyles()
  const { lists, wishes } = useLists()
  const list = lists[listId]
  if (!list) return null
  const listWishes = pick(list.wishes.map(prop('id')))(wishes)
  return (
    <Paper className={classes.paper}>
      <ListHeader headline={list.headline} listId={listId} />
      <MaterialList>
        {Object.entries(listWishes).map(([id, wish]) => (
          <WishListItem id={id} wish={wish} editWish={editWish} />
        ))}
        <Divider variant='inset' component='li' />
      </MaterialList>
      <div>
        <Button variant='outlined' onClick={() => editWish()}>
          Make a wish
        </Button>
      </div>
      <WishFormModal
        hookFormProps={hookFormProps}
        wishId={formWishId}
        isOpen={wishFormIsOpen}
        listId={listId}
        close={() => setWishFormIsOpen(false)}
      />
    </Paper>
  )
}

const useWishListItemBodyStyles = makeStyles((theme) => ({
  container: {
    marginRight: theme.spacing(6),
    display: 'flex',
    flexDirection: 'column'
  },
  infoBar: {
    marginTop: theme.spacing(1),
    display: 'flex',
    flexDirection: 'row'
  }
}))

const useAvatarStyles = makeStyles((theme) => ({
  root: {
    cursor: 'pointer',
    transition: 'all .2s ease-in-out',
    '&:hover': {
      transform: 'scale(1.1)'
    }
  }
}))

const WishListItem = ({ id, wish, editWish }) => {
  const wishListItemTextClasses = useWishListItemBodyStyles()
  const avatarClasses = useAvatarStyles()
  const avatar = (
    <Avatar
      classes={avatarClasses}
      variant='rounded'
      alt={wish.title}
      src={wish.image || '/static/images/avatar/1.jpg'}
    />
  )
  return (
    <ListItem alignItems='flex-start' key={id}>
      <ListItemAvatar>
        {wish.image ? (
          <Lightbox
            src={wish.image}
            alt={wish.title}
            activationElement={avatar}
          />
        ) : (
          avatar
        )}
      </ListItemAvatar>
      <ListItemText
        disableTypography
        primary={
          <Typography component='h2' variant='h6'>
            {wish.title}
          </Typography>
        }
        secondary={
          <div className={wishListItemTextClasses.container}>
            <Typography variant='body2'>{wish.description}</Typography>
            <div className={wishListItemTextClasses.infoBar}>
              <Typography variant='body1'>
                <strong>Price:</strong> {wish.price}
              </Typography>
            </div>
          </div>
        }
      />
      <ListItemSecondaryAction>
        <IconButton onClick={() => editWish(id, wish)} aria-label='edit'>
          <EditIcon />
        </IconButton>
        <IconButton edge='end' aria-label='delete'>
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  )
}

export default List
