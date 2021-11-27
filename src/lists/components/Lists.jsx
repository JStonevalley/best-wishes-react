import React from 'react'
import { Link } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import makeStyles from '@mui/styles/makeStyles'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Divider from '@mui/material/Divider'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import { Paper } from '@mui/material'
import { ownListsState } from '../../store/lists'

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2, 2)
  },
  inline: {
    display: 'inline'
  },
  listItemText: {
    color: theme.palette.text.primary
  }
}))

const Lists = () => {
  const classes = useStyles()
  const lists = useRecoilValue(ownListsState)
  return (
    <Paper className={classes.paper}>
      <Typography component='h1' variant='h4'>
        My lists
      </Typography>
      <List>
        {Object.entries(lists).map(([id, listDoc]) => (
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
              className={classes.listItemText}
              primary={listDoc.data().headline}
              secondary={id}
            />
          </ListItem>
        ))}
        <Divider variant='inset' component='li' />
      </List>
    </Paper>
  )
}

export default Lists
