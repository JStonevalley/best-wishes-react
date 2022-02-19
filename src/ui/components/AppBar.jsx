import React from 'react'
import { getAuth, signOut } from 'firebase/auth'
import { AppBar, Toolbar, Typography, Button } from '@mui/material'
import { Link } from 'react-router-dom'
import { useUser } from '../../store/user'

export default function ButtonAppBar() {
  const user = useUser()
  return (
    <AppBar position='static'>
      <Toolbar>
        <Typography variant='h6' sx={{ flexGrow: 1 }}>
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
