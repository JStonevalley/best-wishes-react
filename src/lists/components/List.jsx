import React, { useState } from 'react'
import { useRecoilValue } from 'recoil'
import { styled } from '@mui/system'
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
import { ownSharesState } from '../../store/lists'
import WishFormModal from './WishForm'
import { useForm } from 'react-hook-form'
import { Lightbox } from '../../ui/components/Lightbox.jsx'
import { ShareFormDialog } from '../../share/components/ShareForm.jsx'
import { useWishMaking } from '../wishMaking'
import { GET_CURRENT_USER } from '../../auth/gql'
import { useQuery } from '@apollo/client'
import { GET_OWN_WISH_LIST } from '../gql'

const ListHeader = ({ headline, listId, editWish }) => {
  const shares = useRecoilValue(ownSharesState)
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between'
      }}
    >
      <Typography component='h1' variant='h4'>
        {headline}
      </Typography>
      <div
        style={{
          display: 'flex'
        }}
      >
        <IconButton onClick={() => editWish()} size='large'>
          <AddIcon />
        </IconButton>
        {shares && <ShareFormDialog listId={listId} shares={shares} />}
      </div>
    </div>
  )
}

const List = ({
  match: {
    params: { listId }
  }
}) => {
  const [wishFormIsOpen, setWishFormIsOpen] = useState(false)
  const [formWishId, setFormWishId] = useState()
  const { data: userData } = useQuery(GET_CURRENT_USER)
  const hookFormProps = useForm()
  const editWish = (id, wish) => {
    setFormWishId(id)
    const defaultValues = wish
      ? {
          ...wish,
          price: wish.price
            ? {
                amount: wish.price.amount / 100,
                currency: wish.price.currency
              }
            : undefined
        }
      : {
          link: undefined,
          title: undefined,
          description: undefined,
          price: { amount: undefined, currency: 'SEK' },
          image: undefined,
          quantity: 1,
          ownerUID: userData?.user.googleUserId
        }
    hookFormProps.reset(defaultValues, {
      keepValues: false
    })
    setWishFormIsOpen(true)
  }
  const { data: wishListData } = useQuery(GET_OWN_WISH_LIST, {
    variables: { id: listId }
  })
  const list = wishListData?.wishList
  if (!list) return null
  return (
    <Paper sx={{ padding: 2 }}>
      <ListHeader
        headline={list.headline}
        listId={listId}
        editWish={editWish}
      />
      <MaterialList>
        {list.wishes.map((wish) => {
          return (
            <WishListItem
              key={`wishListItem-${wish.id}`}
              id={wish.id}
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

const Toolbar = styled('div')({
  display: 'flex',
  flexDirection: 'row'
})

const InfoBar = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(1),
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between'
}))

const ZoomingAvatar = styled(Avatar)({
  cursor: 'pointer',
  transition: 'all .2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.1)'
  }
})

const WishListItem = ({ id, wish, listId, editWish }) => {
  const { removeAWish } = useWishMaking()
  const avatar = (
    <ZoomingAvatar
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
          <div
            style={{
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Typography variant='body2'>{wish.description}</Typography>
            <InfoBar>
              <Typography variant='body1'>
                {wish.price ? (
                  <span>
                    <strong>Price:</strong> {wish.price.amount / 100}{' '}
                    <strong>{wish.price.currency}</strong>
                  </span>
                ) : (
                  ''
                )}
              </Typography>
              <Toolbar>
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
              </Toolbar>
            </InfoBar>
          </div>
        }
      />
    </ListItem>
  )
}

export default List
