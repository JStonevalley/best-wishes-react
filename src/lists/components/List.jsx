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
  Badge,
  CircularProgress
} from '@mui/material'
import Box from '@mui/material/Box'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import AddIcon from '@mui/icons-material/Add'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import WishFormModal from './WishForm'
import { useForm } from 'react-hook-form'
import { Lightbox } from '../../ui/components/Lightbox.jsx'
import { ShareFormDialog } from '../../share/components/ShareForm.jsx'
import { GET_CURRENT_USER } from '../../auth/gql'
import { useMutation, useQuery } from '@apollo/client'
import {
  GET_OWN_WISH_LIST,
  REMOVE_A_WISH,
  UPDATE_WISH_ORDER_FOR_WISH_LIST
} from '../gql'
import { GET_SHARE } from '../../share/gql'
import { ClaimWish } from './ClaimWish'
import { swap } from 'ramda'
import { useParams } from 'react-router-dom'
import { ChangeWishListFormModal } from './WishListForm'

const ListHeader = ({ headline, archivedAt, wishListId, addWish, shares }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: 3,
        marginLeft: 3,
        marginRight: 3
      }}
    >
      <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        padding: '10px 12px 14px 12px'
      }}>
        <Typography component='h1' variant='h4'>
          {headline}
        </Typography>
        {addWish && !archivedAt && <ChangeWishListFormModal headline={headline} wishListId={wishListId} />}
      </Box>
      <Box
        style={{
          display: 'flex'
        }}
      >
        {addWish && !archivedAt && (
          <IconButton onClick={addWish} size='large'>
            <AddIcon />
          </IconButton>
        )}
        {addWish && shares && !archivedAt && (
          <ShareFormDialog listId={wishListId} shares={shares} />
        )}
      </Box>
    </Box>
  )
}

export const OwnerList = () => {
  const { listId } = useParams()
  const [wishFormIsOpen, setWishFormIsOpen] = useState(false)
  const [formWishId, setFormWishId] = useState()
  const { data: userData } = useQuery(GET_CURRENT_USER)
  const [removeAWish] = useMutation(REMOVE_A_WISH, {
    refetchQueries: [{ query: GET_OWN_WISH_LIST, variables: { id: listId } }]
  })
  const [updateWishOrderForWishList] = useMutation(
    UPDATE_WISH_ORDER_FOR_WISH_LIST
  )
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
  const { data: wishListData, loading } = useQuery(GET_OWN_WISH_LIST, {
    variables: { id: listId },
    skip: !userData?.user?.id
  })
  const list = wishListData?.wishList
  if (!list) return null
  return (
    <ListPresentation
      list={list}
      loading={loading}
      ownerProps={{
        editWish,
        removeAWish,
        updateWishOrderForWishList,
        hookFormProps,
        formWishId,
        wishFormIsOpen,
        setWishFormIsOpen
      }}
    />
  )
}

export const SharedList = () => {
  const { shareId } = useParams()
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
  loading,
  ownerProps: {
    editWish,
    removeAWish,
    updateWishOrderForWishList,
    hookFormProps,
    formWishId,
    wishFormIsOpen,
    setWishFormIsOpen
  } = {}
}) => {
  list = list || share.wishList
  return (
    <Paper
      sx={{
        padding: 2,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <ListHeader
        headline={list.headline}
        wishListId={list.id}
        archivedAt={list.archivedAt}
        addWish={editWish ? () => editWish() : undefined}
        shares={list.shares}
      />
      {loading && <CircularProgress sx={{ alignSelf: 'center' }} />}
      <MaterialList>
        {list.wishOrder
          .map((wishId) => list.wishes.find((wish) => wish.id === wishId))
          .filter(Boolean)
          .map((wish, index) => {
            return (
              <WishListItem
                key={`wishListItem-${wish.id}`}
                wishList={list}
                wish={wish}
                editWish={editWish}
                removeAWish={removeAWish}
                updateWishOrderForWishList={updateWishOrderForWishList}
                share={share}
                shares={list.shares}
                listArchivedAt={list.archivedAt}
                first={index === 0}
                last={index === list.wishes.length - 1}
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

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    left: -3,
    top: 6,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px'
  }
}))

const WishListItem = ({
  wish,
  wishList,
  editWish,
  removeAWish,
  updateWishOrderForWishList,
  share,
  shares,
  listArchivedAt,
  first,
  last
}) => {
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
  return (
    <ListItem alignItems='flex-start' key={wish.id}>
      <StyledBadge
        badgeContent={wish.quantity}
        color='primary'
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
      >
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
      </StyledBadge>
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
                    {wish.price.amount / 100}{' '}
                    <strong>{wish.price.currency}</strong>
                  </span>
                ) : (
                  ''
                )}
              </Typography>
              <Toolbar sx={{ alignItems: 'center' }}>
                {!share && !listArchivedAt && (
                  <>
                    <IconButton
                      onClick={() => {
                        const indexOfWish = wishList.wishOrder.indexOf(wish.id)
                        const newWishOrder = swap(
                          indexOfWish,
                          indexOfWish - 1
                        )(wishList.wishOrder)
                        updateWishOrderForWishList({
                          variables: {
                            id: wishList.id,
                            wishOrder: newWishOrder
                          },
                          optimisticResponse: {
                            wishList: {
                              id: wishList.id,
                              __typename: 'WishList',
                              wishOrder: newWishOrder
                            }
                          }
                        })
                      }}
                      aria-label='move-up'
                      size='small'
                      disabled={first}
                    >
                      <ArrowUpwardIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        const indexOfWish = wishList.wishOrder.indexOf(wish.id)
                        const newWishOrder = swap(
                          indexOfWish,
                          indexOfWish + 1
                        )(wishList.wishOrder)
                        updateWishOrderForWishList({
                          variables: {
                            id: wishList.id,
                            wishOrder: newWishOrder
                          },
                          optimisticResponse: {
                            wishList: {
                              id: wishList.id,
                              __typename: 'WishList',
                              wishOrder: newWishOrder
                            }
                          }
                        })
                      }}
                      aria-label='move-down'
                      size='small'
                      disabled={last}
                    >
                      <ArrowDownwardIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => editWish(wish.id, wish)}
                      aria-label='edit'
                      size='small'
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() =>
                        removeAWish({ variables: { id: wish.id } })
                      }
                      edge='end'
                      aria-label='delete'
                      size='small'
                      color='error'
                    >
                      <DeleteIcon />
                    </IconButton>
                  </>
                )}
                {share && (
                  <>
                    <ClaimWish
                      share={share}
                      wishId={wish.id}
                      wishQuantity={wish.quantity}
                      claimedByEmail={claimedByEmail}
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
