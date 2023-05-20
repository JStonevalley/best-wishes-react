import React from 'react'
import { getAuth, signOut } from 'firebase/auth'
import { AppBar, Toolbar, Typography, Button } from '@mui/material'
import { Link } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { GET_CURRENT_USER } from '../../auth/gql'

export default function ButtonAppBar() {
  const { data: userData } = useQuery(GET_CURRENT_USER)
  return (
    <AppBar position='static'>
      <Toolbar>
        <Typography variant='h6' sx={{ flexGrow: 1 }}>
          Bestwishes
        </Typography>
        {!userData?.user ? (
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
