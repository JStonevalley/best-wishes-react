import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import InboxIcon from '@material-ui/icons/MoveToInbox'
import ListIcon from '@material-ui/icons/List'
import { Link } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
  menuButtonInAppBar: {
    marginRight: theme.spacing(2)
  },
  menuButtonInMenu: {
    alignSelf: 'flex-start',
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(1)
  },
  title: {
    flexGrow: 1
  }
}))

export default function ButtonAppBar() {
  const classes = useStyles()
  const [drawerIsOpen, setDrawerIsOpen] = useState(false)

  return (
    <>
      <AppBar position='static'>
        <Toolbar>
          <IconButton
            edge='start'
            className={classes.menuButtonInAppBar}
            color='inherit'
            aria-label='menu'
            onClick={() => setDrawerIsOpen(!drawerIsOpen)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant='h6' className={classes.title}>
            Bestwishes
          </Typography>
          <Link
            to='/login'
            style={{ color: 'inherit', textDecoration: 'inherit' }}
          >
            <Button color='inherit'>Login</Button>
          </Link>
          <Link
            to='/signup'
            style={{ color: 'inherit', textDecoration: 'inherit' }}
          >
            <Button color='inherit'>Signup</Button>
          </Link>
        </Toolbar>
      </AppBar>
      <SwipeableDrawer
        anchor='left'
        open={drawerIsOpen}
        onClose={() => setDrawerIsOpen(false)}
        onOpen={() => setDrawerIsOpen(true)}
      >
        <IconButton
          edge='start'
          className={classes.menuButtonInMenu}
          color='inherit'
          aria-label='menu'
          onClick={() => setDrawerIsOpen(!drawerIsOpen)}
        >
          <MenuIcon />
        </IconButton>
        <List>
          <ListItem button>
            <ListItemIcon>
              <ListIcon />
            </ListItemIcon>
            <ListItemText primary='My lists' />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary='Lists shared with me' />
          </ListItem>
        </List>
      </SwipeableDrawer>
    </>
  )
}
