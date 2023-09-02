import React from 'react'
import { Link } from 'react-router-dom'
import {
  IconButton,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar
} from '@mui/material'
import CakeIcon from '@mui/icons-material/Cake'
import ArchiveIcon from '@mui/icons-material/Archive'
import UnarchiveIcon from '@mui/icons-material/Unarchive'

export const WishListListItem = ({
  shareId,
  wishList: { id, headline, wishes },
  archiveWishList,
  unarchiveWishList,
  loading
}) => {
  const image = wishes.map((wish) => wish.image).filter(Boolean)[0]
  return (
    <ListItem
      component={Link}
      to={shareId || id}
      alignItems='flex-start'
      secondaryAction={
        (archiveWishList || unarchiveWishList) &&
        (archiveWishList ? (
          <IconButton
            onClick={(event) => {
              archiveWishList({
                variables: { id },
                optimisticResponse: {
                  wishList: {
                    id,
                    __typename: 'WishList',
                    archivedAt: new Date()
                  }
                }
              })
              event.preventDefault()
            }}
            edge='end'
            aria-label='archive-wish-list'
            size='large'
            disabled={loading}
          >
            <ArchiveIcon />
          </IconButton>
        ) : (
          <IconButton
            onClick={(event) => {
              unarchiveWishList({
                variables: { id },
                optimisticResponse: {
                  wishList: {
                    id,
                    __typename: 'WishList',
                    archivedAt: null
                  }
                }
              })
              event.preventDefault()
            }}
            edge='end'
            aria-label='unarchive-wish-list'
            size='large'
            disabled={loading}
          >
            <UnarchiveIcon />
          </IconButton>
        ))
      }
    >
      <ListItemAvatar>
        <Avatar>
          {image ? (
            <Avatar alt='Gift' src={image} />
          ) : (
            <Avatar>
              <CakeIcon />
            </Avatar>
          )}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        sx={{ color: 'text.primary' }}
        primary={headline}
        primaryTypographyProps={{ variant: 'h6' }}
      />
    </ListItem>
  )
}
