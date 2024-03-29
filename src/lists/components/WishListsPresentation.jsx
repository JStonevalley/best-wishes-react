import React from 'react'
import { Link as ReactRouterLink } from 'react-router-dom'
import { IconButton, ListItem, ListItemText, ListItemAvatar, Avatar, Toolbar, Link } from '@mui/material'
import CakeIcon from '@mui/icons-material/Cake'
import ArchiveIcon from '@mui/icons-material/Archive'
import UnarchiveIcon from '@mui/icons-material/Unarchive'
import { ChangeWishListFormModal } from './WishListForm'

export const WishListListItem = ({
  shareId,
  wishList: { id, headline, wishes, archivedAt },
  archiveWishList,
  unarchiveWishList,
  loading
}) => {
  const image = wishes.map((wish) => wish.image).filter(Boolean)[0]
  return (
    <ListItem
      secondaryAction={
        <Toolbar>
          {!shareId && !archivedAt && <ChangeWishListFormModal headline={headline} wishListId={id} />}
          {(archiveWishList || unarchiveWishList) &&
            (archiveWishList ? (
              <IconButton
                onClick={() => {
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
                onClick={() => {
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
                }}
                edge='end'
                aria-label='unarchive-wish-list'
                size='large'
                disabled={loading}
              >
                <UnarchiveIcon />
              </IconButton>
            ))}
        </Toolbar>
      }
    >
      <ListItemAvatar>
        <Link component={ReactRouterLink} to={shareId || id} underline='none' color='inherit'>
          <Avatar>
            {image ? (
              <Avatar alt='Gift' src={image} />
            ) : (
              <Avatar>
                <CakeIcon />
              </Avatar>
            )}
          </Avatar>
        </Link>
      </ListItemAvatar>
      <Link component={ReactRouterLink} to={shareId || id} underline='none' color='inherit' style={{ flex: '1 1 auto' }}>
        <ListItemText sx={{ color: 'text.primary' }} primary={headline} primaryTypographyProps={{ variant: 'h6' }} />
      </Link>
    </ListItem>
  )
}
