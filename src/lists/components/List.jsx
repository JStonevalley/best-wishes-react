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
  const [formMode, setFormMode] = useState('create')
  const hookFormProps = useForm()
  const editWish = (wish) => {
    setFormMode(wish ? 'edit' : 'create')
    hookFormProps.reset(wish)
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
          <ListItem alignItems='flex-start' key={id}>
            <ListItemAvatar>
              <Avatar alt='Remy Sharp' src='/static/images/avatar/1.jpg' />
            </ListItemAvatar>
            <ListItemText primary={wish.headline} secondary={id} />
            <ListItemSecondaryAction>
              <IconButton onClick={() => editWish(wish)} aria-label='edit'>
                <EditIcon />
              </IconButton>
              <IconButton edge='end' aria-label='delete'>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
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
        formMode={formMode}
        isOpen={wishFormIsOpen}
        close={() => setWishFormIsOpen(false)}
      />
    </Paper>
  )
}

export default List
