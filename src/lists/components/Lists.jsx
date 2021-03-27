import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Divider from '@material-ui/core/Divider'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'
import { Paper } from '@material-ui/core'
import { useLists } from '../../store/lists'

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2, 2)
  },
  inline: {
    display: 'inline'
  }
}))

const Lists = () => {
  const classes = useStyles()
  const { lists, wishes } = useLists()
  console.log(lists, wishes)
  return (
    <Paper className={classes.paper}>
      <Typography component='h1' variant='h4'>
        My lists
      </Typography>
      <List>
        {Object.entries(lists).map(([id, { headline }]) => (
          <ListItem alignItems='flex-start' key={id}>
            <ListItemAvatar>
              <Avatar alt='Remy Sharp' src='/static/images/avatar/1.jpg' />
            </ListItemAvatar>
            <ListItemText
              primary={headline}
              secondary={
                <React.Fragment>
                  <Typography
                    component='span'
                    variant='body2'
                    className={classes.inline}
                    color='textPrimary'
                  >
                    Ali Connors
                  </Typography>
                  {" — I'll be in your neighborhood doing errands this…"}
                </React.Fragment>
              }
            />
          </ListItem>
        ))}
        <Divider variant='inset' component='li' />
      </List>
    </Paper>
  )
}

export default Lists
