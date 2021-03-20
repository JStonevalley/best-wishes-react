import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  SwipeableDrawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
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
