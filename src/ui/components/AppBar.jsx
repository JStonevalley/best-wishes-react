import React from 'react'
import { getAuth, signOut } from 'firebase/auth'
import { makeStyles } from '@material-ui/core/styles'
import { AppBar, Toolbar, Typography, Button } from '@material-ui/core'
import { Link } from 'react-router-dom'
import { useUser } from '../../store/user'

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
  const user = useUser()
  return (
    <AppBar position='static'>
      <Toolbar>
        <Typography variant='h6' className={classes.title}>
          Bestwishes
        </Typography>
        {user === null ? (
          <>
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
          </>
        ) : (
          <Button color='inherit' onClick={() => signOut(getAuth())}>
            Logout
          </Button>
        )}
      </Toolbar>
    </AppBar>
  )
}
