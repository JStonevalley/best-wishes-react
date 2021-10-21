import React from 'react'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Divider from '@material-ui/core/Divider'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'
import { Paper } from '@material-ui/core'
import { useOwnLists } from '../../store/lists'

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
  const { lists = {} } = useOwnLists()
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
