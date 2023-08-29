import React from 'react'
import { Link } from 'react-router-dom'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Divider from '@mui/material/Divider'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import { Paper } from '@mui/material'
import CakeIcon from '@mui/icons-material/Cake'

const WishListsPresentation = ({ title, wishLists, shares, loading }) => {
  return (
    <Paper sx={{ padding: 2 }}>
      <Typography
        component='h1'
        variant='h4'
        sx={{ marginTop: 3, marginLeft: 3, marginRight: 3 }}
      >
        {title}
      </Typography>
      {wishLists && (
        <List>
          {wishLists.map((wishList) => (
            <WishListListItem key={wishList.id} wishList={wishList} />
          ))}
          <Divider variant='inset' component='li' />
        </List>
      )}
      {shares && (
        <List>
          {shares.map(({ id: shareId, wishList }) => (
            <WishListListItem
              key={shareId}
              shareId={shareId}
              wishList={wishList}
            />
          ))}
          <Divider variant='inset' component='li' />
        </List>
      )}
    </Paper>
  )
}

const WishListListItem = ({ shareId, wishList: { id, headline, wishes } }) => {
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

export default WishListsPresentation
