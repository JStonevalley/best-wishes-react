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
import { useLists } from '../../store/lists'
import { pick, prop } from 'ramda'
import WishFormModal from './WishForm'
import { useForm } from 'react-hook-form'
import { useUser } from '../../store/user'

const useStyles = makeStyles((theme) => ({
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
  const classes = useStyles()
  const { lists, wishes } = useLists()
  const list = lists[listId]
  if (!list) return null
  const listWishes = pick(list.wishes.map(prop('id')))(wishes)
  return (
    <Paper className={classes.paper}>
      <Typography component='h1' variant='h4'>
        {list.headline}
      </Typography>
      <MaterialList>
        {Object.entries(listWishes).map(([id, wish]) => (
          <WishListItem id={id} wish={wish} editWish={editWish} />
        ))}
        <Divider variant='inset' component='li' />
      </MaterialList>
      <div>
        <Button variant='outlined' onClick={() => editWish()}>
          Make a swish
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

const WishListItem = ({ id, wish, editWish }) => {
  const wishListItemTextClasses = useWishListItemBodyStyles()
  console.log(wish)
  return (
    <ListItem alignItems='flex-start' key={id}>
      <ListItemAvatar>
        <Avatar
          alt={wish.title}
          src={wish.image || '/static/images/avatar/1.jpg'}
        />
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
