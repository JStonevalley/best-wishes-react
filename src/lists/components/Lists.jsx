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
import { useQuery } from '@apollo/client'
import { GET_OWN_WISH_LISTS } from '../gql'

const Lists = () => {
  const { data: listsData } = useQuery(GET_OWN_WISH_LISTS)
  return (
    <Paper sx={{ padding: 2 }}>
      <Typography component='h1' variant='h4'>
        My lists
      </Typography>
      {listsData?.wishLists && (
        <List>
          {listsData.wishLists.map(({ id, headline }) => (
            <ListItem
              component={Link}
              to={`list/${id}`}
              alignItems='flex-start'
              key={id}
            >
              <ListItemAvatar>
                <Avatar alt='Remy Sharp' src='/static/images/avatar/1.jpg' />
              </ListItemAvatar>
              <ListItemText
                sx={{ color: 'text.primary' }}
                primary={headline}
                secondary={id}
              />
            </ListItem>
          ))}
          <Divider variant='inset' component='li' />
        </List>
      )}
    </Paper>
  )
}

export default Lists
