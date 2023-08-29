import React from 'react'
import { Link } from 'react-router-dom'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import CakeIcon from '@mui/icons-material/Cake'

export const WishListListItem = ({
  shareId,
  wishList: { id, headline, wishes }
}) => {
  const image = wishes.map((wish) => wish.image).filter(Boolean)[0]
  return (
    <ListItem
      component={Link}
      to={shareId ? `shared/${shareId}` : `list/${id}`}
      alignItems='flex-start'
      key={id}
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
