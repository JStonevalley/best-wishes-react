import React, { useState } from 'react'
import { useRecoilValue } from 'recoil'
import makeStyles from '@mui/styles/makeStyles'
import {
  List as MaterialList,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Paper,
  IconButton
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import AddIcon from '@mui/icons-material/Add'
import {
  ownListsState,
  ownWishesState,
  ownSharesState
} from '../../store/lists'
import { prop } from 'ramda'
import WishFormModal from './WishForm'
import { useForm } from 'react-hook-form'
import { useUser } from '../../store/user'
import { Lightbox } from '../../ui/components/Lightbox.jsx'
import { ShareFormDialog } from '../../share/components/ShareForm.jsx'
import { useWishMaking } from '../wishMaking'

const useWishListHeaderStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  toolBar: {
    display: 'flex'
  }
}))

const ListHeader = ({ headline, listId, editWish }) => {
  const classes = useWishListHeaderStyles()
  const shares = useRecoilValue(ownSharesState)
  return (
    <div className={classes.container}>
      <Typography component='h1' variant='h4'>
        {headline}
      </Typography>
      <div className={classes.toolBar}>
        <IconButton onClick={() => editWish()} size='large'>
          <AddIcon />
        </IconButton>
        {shares && <ShareFormDialog listId={listId} shares={shares} />}
      </div>
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
            quantity: 1,
            ownerUID: user.uid
          },
      {
        keepValues: false
      }
    )
    setWishFormIsOpen(true)
  }
  const classes = useWishListStyles()
  const lists = useRecoilValue(ownListsState)
  const wishes = useRecoilValue(ownWishesState)
  const list = lists[listId]?.data()
  if (!list) return null
  return (
    <Paper className={classes.paper}>
      <ListHeader
        headline={list.headline}
        listId={listId}
        editWish={editWish}
      />
      <MaterialList>
        {list.wishes
          .map(prop('id'))
          .filter((wishId) => wishes[wishId])
          .map((wishId) => {
            const wish = wishes[wishId].data()
            return (
              <WishListItem
                key={`wishListItem-${wishId}`}
                id={wishId}
                listId={listId}
                wish={wish}
                editWish={editWish}
              />
            )
          })}
      </MaterialList>
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
    display: 'flex',
    flexDirection: 'column'
  },
  infoBar: {
    marginTop: theme.spacing(1),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  toolBar: {
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

const WishListItem = ({ id, wish, listId, editWish }) => {
  const { removeAWish } = useWishMaking()
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
                {wish.price ? (
                  <span>
                    <strong>Price:</strong> {wish.price}
                  </span>
                ) : (
                  ''
                )}
              </Typography>
              <div className={wishListItemTextClasses.toolBar}>
                <IconButton
                  onClick={() => editWish(id, wish)}
                  aria-label='edit'
                  size='large'
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => removeAWish(listId)(id)}
                  edge='end'
                  aria-label='delete'
                  size='large'
                >
                  <DeleteIcon />
                </IconButton>
              </div>
            </div>
          </div>
        }
      />
    </ListItem>
  )
}

export default List
