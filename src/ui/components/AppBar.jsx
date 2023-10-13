import React from 'react'
import { getAuth, signOut } from 'firebase/auth'
import { AppBar, Toolbar, Typography, Button } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../../apollo/UserContext'

export default function ButtonAppBar() {
  const { googleUser } = useUser()
  const navigate = useNavigate()
  return (
    <AppBar position='static'>
      <Toolbar>
        <Typography variant='h6' sx={{ flexGrow: 1 }}>
          Bestwishes
        </Typography>
        {googleUser === undefined ? null : googleUser === null ? (
          <>
            <Link to='/login' style={{ color: 'inherit', textDecoration: 'inherit' }}>
              <Button color='inherit'>Login</Button>
            </Link>
            <Link to='/signup' style={{ color: 'inherit', textDecoration: 'inherit' }}>
              <Button color='inherit'>Signup</Button>
            </Link>
          </>
        ) : (
          <Button
            color='inherit'
            onClick={() => {
              signOut(getAuth())
              navigate('/login')
            }}
          >
            Logout
          </Button>
        )}
      </Toolbar>
    </AppBar>
  )
}
