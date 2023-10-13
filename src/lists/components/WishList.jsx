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
import { GET_OWN_WISH_LIST, REMOVE_A_WISH, UPDATE_WISH_ORDER_FOR_WISH_LIST } from '../gql'
import { GET_SHARE } from '../../share/gql'
import { ClaimWish } from './ClaimWish'
import { swap } from 'ramda'
import { useParams } from 'react-router-dom'
import { ChangeWishListFormModal } from './WishListForm'
import { ButtonWithConfirmation } from '../../ui/components/ButtonWithConfirmation'
import { ToggleListView } from './ToggleListView'
import { VIEWS, useListViewController } from './ToggleListViewController'

const ListHeaderContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  marginTop: theme.spacing(3),
  marginLeft: theme.spacing(3),
  marginRight: theme.spacing(3)
}))

const ListHeaderToolbar = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: theme.spacing(3)
}))

const ListHeader = ({ headline, archivedAt, wishListId, addWish, shares, listViewControls: { view, setView } }) => {
  return (
    <ListHeaderContainer>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center'
        }}
      >
        <Typography component='h1' variant={headline.length > 12 ? 'h6' : 'h4'}>
          {headline}
        </Typography>
        {addWish && !archivedAt && <ChangeWishListFormModal headline={headline} wishListId={wishListId} />}
      </div>
      <ListHeaderToolbar>
        <ToggleListView view={view} setView={setView} />
        <div
          style={{
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {addWish && !archivedAt && (
            <IconButton onClick={addWish} size='large'>
              <AddIcon />
            </IconButton>
          )}
          {addWish && shares && !archivedAt && <ShareFormDialog listId={wishListId} shares={shares} />}
        </div>
      </ListHeaderToolbar>
    </ListHeaderContainer>
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
  const [updateWishOrderForWishList] = useMutation(UPDATE_WISH_ORDER_FOR_WISH_LIST)
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
  ownerProps: { editWish, removeAWish, updateWishOrderForWishList, hookFormProps, formWishId, wishFormIsOpen, setWishFormIsOpen } = {}
}) => {
  const { view, setView } = useListViewController()
  list = list || share.wishList
  const ListComponent = view === VIEWS.DENSE ? WishListList : WishListTiled
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
        listViewControls={{ view, setView }}
      />
      {loading && <CircularProgress sx={{ alignSelf: 'center' }} />}
      <ListComponent
        list={list}
        editWish={editWish}
        removeAWish={removeAWish}
        updateWishOrderForWishList={updateWishOrderForWishList}
        share={share}
      />
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

const StyledListAvatarBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    left: -3,
    top: 6,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px'
  }
}))

const WishListList = ({ list, editWish, removeAWish, updateWishOrderForWishList, share }) => {
  return (
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
              index={index}
            />
          )
        })}
    </MaterialList>
  )
}

const ItemToolbar = ({
  wish,
  wishList,
  share,
  shares,
  claimedByEmail,
  listArchivedAt,
  updateWishOrderForWishList,
  editWish,
  removeAWish,
  first,
  last,
  style
}) => {
  return (
    <Toolbar sx={{ alignItems: 'center' }} style={style}>
      {!share && !listArchivedAt && (
        <>
          <IconButton
            onClick={() => {
              const indexOfWish = wishList.wishOrder.indexOf(wish.id)
              const newWishOrder = swap(indexOfWish, indexOfWish - 1)(wishList.wishOrder)
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
              const newWishOrder = swap(indexOfWish, indexOfWish + 1)(wishList.wishOrder)
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
          <IconButton onClick={() => editWish(wish.id, wish)} aria-label='edit' size='small'>
            <EditIcon />
          </IconButton>
          <ButtonWithConfirmation
            actionToConfirm={() => removeAWish({ variables: { id: wish.id } })}
            confirmationDialogTitle='Are you sure you want to delete this wish?'
            confirmationDialogContent={
              shares > 0
                ? 'The wish list has already been shared and some kind gift giver may already have aquired this gift for you.'
                : null
            }
            button={
              <IconButton edge='end' aria-label='delete' size='small' color='error'>
                <DeleteIcon />
              </IconButton>
            }
          />
        </>
      )}
      {share && (
        <>
          <ClaimWish share={share} wishId={wish.id} wishQuantity={wish.quantity} claimedByEmail={claimedByEmail} />
        </>
      )}
    </Toolbar>
  )
}

const createClaimedByEmail = ({ wish, shares }) =>
  shares.reduce((quantityByShare, share) => {
    quantityByShare[share.invitedEmail] =
      (quantityByShare[share.invitedEmail] || 0) + share.claimedWishIds.filter((claimedWishId) => claimedWishId === wish.id).length
    return quantityByShare
  }, {})

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
  last,
  index
}) => {
  const avatar = <ZoomingAvatar variant='rounded' alt={wish.title} src={wish.image || `/christmas_gift_placeholder_${index % 5}.jpg`} />

  const claimedByEmail = createClaimedByEmail({ wish, shares })
  return (
    <ListItem alignItems='flex-start' key={wish.id}>
      <StyledListAvatarBadge
        badgeContent={wish.quantity}
        color='primary'
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
      >
        <ListItemAvatar>{wish.image ? <Lightbox src={wish.image} alt={wish.title} activationElement={avatar} /> : avatar}</ListItemAvatar>
      </StyledListAvatarBadge>
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
                    {wish.price.amount / 100} <strong>{wish.price.currency}</strong>
                  </span>
                ) : (
                  ''
                )}
              </Typography>
              <ItemToolbar
                wish={wish}
                wishList={wishList}
                share={share}
                shares={shares}
                claimedByEmail={claimedByEmail}
                listArchivedAt={listArchivedAt}
                updateWishOrderForWishList={updateWishOrderForWishList}
                editWish={editWish}
                removeAWish={removeAWish}
                first={first}
                last={last}
              />
            </InfoBar>
          </div>
        }
      />
    </ListItem>
  )
}

const TileItemList = styled('ul')(({ theme }) => ({
  margin: theme.spacing(2),
  paddingInlineStart: '0px'
}))

const WishListTiled = ({ list, editWish, removeAWish, updateWishOrderForWishList, share }) => {
  return (
    <TileItemList>
      {list.wishOrder
        .map((wishId) => list.wishes.find((wish) => wish.id === wishId))
        .filter(Boolean)
        .map((wish, index) => {
          return (
            <WishTileItem
              key={`wishTileItem-${wish.id}`}
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
              index={index}
            />
          )
        })}
    </TileItemList>
  )
}

const TileListItem = styled('li')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  margin: theme.spacing(4, 0)
}))

const StyledTileImageBadge = styled('span')(({ theme }) => ({
  position: 'absolute',
  border: `2px solid ${theme.palette.background.paper}`,
  left: 12,
  top: 12,
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
  fontWeight: 'bold',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center'
}))

const TileImageContainer = styled('div')(({ theme }) => ({
  position: 'relative',
  alignSelf: 'flex-start',
  marginRight: theme.spacing(2),
  flex: '1 0 250px'
}))

const TileImage = ({ imageUrl, quantity }) => (
  <TileImageContainer>
    <StyledTileImageBadge>{quantity}</StyledTileImageBadge>
    <img
      src={imageUrl}
      style={{
        width: '100%',
        aspectRatio: '1/1',
        objectFit: 'contain',
        borderRadius: '8px'
      }}
      alt='wish'
    />
  </TileImageContainer>
)

const WishTileItem = ({
  wish,
  wishList,
  editWish,
  removeAWish,
  updateWishOrderForWishList,
  share,
  shares,
  listArchivedAt,
  first,
  last,
  index
}) => {
  return (
    <TileListItem>
      <TileImage imageUrl={wish.image || `/christmas_gift_placeholder_${index % 5}.jpg`} quantity={wish.quantity} />
      <div style={{ flex: '1 0 250px', display: 'flex', flexDirection: 'column' }}>
        <Typography paragraph variant='h5' component='h2'>
          {wish.title}
        </Typography>
        {wish.description && (
          <Typography paragraph variant='body1'>
            {wish.description}
          </Typography>
        )}
        <div style={{ flexGrow: 1 }} />
        <InfoBar>
          <Typography variant='body1'>
            {wish.price ? (
              <span>
                {wish.price.amount / 100} <strong>{wish.price.currency}</strong>
              </span>
            ) : (
              ''
            )}
          </Typography>
          <ItemToolbar
            wish={wish}
            wishList={wishList}
            share={share}
            shares={shares}
            claimedByEmail={createClaimedByEmail({ wish, shares })}
            listArchivedAt={listArchivedAt}
            updateWishOrderForWishList={updateWishOrderForWishList}
            editWish={editWish}
            removeAWish={removeAWish}
            first={first}
            last={last}
          />
        </InfoBar>
      </div>
    </TileListItem>
  )
}
