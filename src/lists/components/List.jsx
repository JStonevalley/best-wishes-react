import React, { useState } from 'react'
import { styled } from '@mui/system'
import {
  List as MaterialList,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Paper,
  IconButton,
  Tooltip,
  Button
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import AddIcon from '@mui/icons-material/Add'
import WishFormModal from './WishForm'
import { useForm } from 'react-hook-form'
import { Lightbox } from '../../ui/components/Lightbox.jsx'
import { ShareFormDialog } from '../../share/components/ShareForm.jsx'
import { GET_CURRENT_USER } from '../../auth/gql'
import { useQuery } from '@apollo/client'
import { GET_OWN_WISH_LIST } from '../gql'
import { GET_SHARE } from '../../share/gql'
import { mapObjIndexed } from 'ramda'
import { QuantityIndicator } from '../../ui/components/QuantityIndicator'
import { GiveGift } from './GiveGift'

const ListHeader = ({ headline, listId, addWish, shares }) => {
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
        {addWish && (
          <IconButton onClick={addWish} size='large'>
            <AddIcon />
          </IconButton>
        )}
        {shares && <ShareFormDialog listId={listId} shares={shares} />}
      </div>
    </div>
  )
}

export const OwnerList = ({
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
          quantity: 1
        }
    hookFormProps.reset(defaultValues, {
      keepValues: false
    })
    setWishFormIsOpen(true)
  }
  const { data: wishListData } = useQuery(GET_OWN_WISH_LIST, {
    variables: { id: listId },
    skip: !userData?.user?.id
  })
  const list = wishListData?.wishList
  if (!list) return null
  return (
    <ListPresentation
      list={list}
      ownerProps={{
        editWish,
        hookFormProps,
        formWishId,
        wishFormIsOpen,
        setWishFormIsOpen
      }}
    />
  )
}

export const SharedList = ({
  match: {
    params: { shareId }
  }
}) => {
  const { data: shareData } = useQuery(GET_SHARE, {
    variables: { id: shareId }
  })
  const share = shareData?.share
  if (!share) return null
  return <ListPresentation share={share} />
}

const ListPresentation = ({
  list,
  share,
  ownerProps: {
    editWish,
    hookFormProps,
    formWishId,
    wishFormIsOpen,
    setWishFormIsOpen
  } = {}
}) => {
  list = list || share.wishList
  console.log(share)
  return (
    <Paper sx={{ padding: 2 }}>
      <ListHeader
        headline={list.headline}
        listId={list.id}
        addWish={editWish ? () => editWish() : undefined}
        shares={list.shares}
      />
      <MaterialList>
        {list.wishes.map((wish) => {
          return (
            <WishListItem
              key={`wishListItem-${wish.id}`}
              id={wish.id}
              listId={list.id}
              wish={wish}
              editWish={editWish}
              share={share}
              shares={list.shares}
            />
          )
        })}
      </MaterialList>
      {hookFormProps && (
        <WishFormModal
          hookFormProps={hookFormProps}
          wishId={formWishId}
          isOpen={wishFormIsOpen}
          listId={list.id}
          close={() => setWishFormIsOpen(false)}
        />
      )}
    </Paper>
  )
}

const Toolbar = styled('div')({
  display: 'flex',
  flexDirection: 'row'
})

const InfoBar = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(2),
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

const WishListItem = ({ id, wish, listId, editWish, share, shares }) => {
  const avatar = (
    <ZoomingAvatar
      variant='rounded'
      alt={wish.title}
      src={wish.image || '/static/images/avatar/1.jpg'}
    />
  )

  const claimedByEmail = (shares || []).reduce((quantityByShare, share) => {
    quantityByShare[share.invitedEmail] =
      (quantityByShare[share.invitedEmail] || 0) +
      share.claimedWishIds.filter((claimedWishId) => claimedWishId === wish.id)
        .length
    return quantityByShare
  }, {})

  const totalClaimedQuantity = Object.values(claimedByEmail).reduce(
    (total, quantity) => total + quantity,
    0
  )

  const amountClaimedByOthers =
    totalClaimedQuantity - claimedByEmail[share.invitedEmail] || 0
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
              {editWish && (
                <Typography variant='body1'>
                  <span>
                    <strong>Quantity:</strong> {wish.quantity}
                  </span>
                </Typography>
              )}
              <Toolbar sx={{ alignItems: 'center' }}>
                {editWish && (
                  <>
                    <IconButton
                      onClick={() => editWish(id, wish)}
                      aria-label='edit'
                      size='large'
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => alert('TODO: remove wish')}
                      edge='end'
                      aria-label='delete'
                      size='large'
                    >
                      <DeleteIcon />
                    </IconButton>
                  </>
                )}
                {!editWish && (
                  <>
                    <Tooltip
                      disableFocusListener
                      title={
                        Object.values(
                          mapObjIndexed(
                            (quantity, email) => `${email}: ${quantity}`
                          )(claimedByEmail)
                        ).join(', ') || ''
                      }
                    >
                      <QuantityIndicator
                        amountClaimedByOthers={amountClaimedByOthers}
                        amountClaimedByYou={
                          claimedByEmail[share.invitedEmail] || 0
                        }
                        total={wish.quantity}
                        sx={{
                          margin: '8px'
                        }}
                      />
                    </Tooltip>
                    <GiveGift
                      amountClaimedByYou={
                        claimedByEmail[share.invitedEmail] || 0
                      }
                    />
                  </>
                )}
              </Toolbar>
            </InfoBar>
          </div>
        }
      />
    </ListItem>
  )
}
