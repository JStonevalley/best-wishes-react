import React from 'react'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth'
import { styled } from '@mui/system'
import { Typography, Paper } from '@mui/material'
import { useForm } from 'react-hook-form'
import AuthDetailsForm from './components/AuthForm'
import { useQuery } from '@apollo/client'
import { GET_CURRENT_USER } from './gql'

const Page = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  flexGrow: 1
}))

const signupError = (error) => {
  switch (error.code) {
    case 'auth/email-already-in-use':
      return [
        'email',
        {
          type: 'manual',
          message: error.message
        }
      ]
    case 'auth/weak-password':
      return [
        'password',
        {
          type: 'manual',
          message: error.message
        }
      ]
    default:
      return [
        'general',
        { type: 'manual', code: error.code, message: error.message }
      ]
  }
}

export const Signup = ({ history }) => {
  useQuery(GET_CURRENT_USER, {
    onCompleted: (userData) => {
      if (userData?.user) {
        history.push('/list')
      }
    }
  })
  const { handleSubmit, setError, ...formProps } = useForm()
  const onSubmit = handleSubmit(async ({ email, password }) => {
    try {
      await createUserWithEmailAndPassword(getAuth(), email, password)
    } catch (error) {
      console.error(error)
      setError(...signupError(error))
    }
  })
  return (
    <Page>
      <Paper sx={{ padding: 2 }} elevation={0}>
        <Typography variant='h6' component='h1' paragraph>
          Welcome, wish to create account?
        </Typography>
        <AuthDetailsForm variant='signin' onSubmit={onSubmit} {...formProps} />
      </Paper>
    </Page>
  )
}

const loginError = (error) => {
  switch (error.code) {
    case 'auth/too-many-requests':
      return [
        'general',
        {
          type: 'manual',
          message:
            'Too many login attempts. Account temporarily blocked. Reset your password to login.'
        }
      ]
    case 'auth/wrong-password':
      return [
        'password',
        {
          type: 'manual',
          message: 'Wrong password'
        }
      ]
    default:
      return [
        'general',
        { type: 'manual', code: error.code, message: error.message }
      ]
  }
}

export const Login = ({ history }) => {
  useQuery(GET_CURRENT_USER, {
    onCompleted: (userData) => {
      if (userData?.user) {
        history.push('/list')
      }
    }
  })
  const { handleSubmit, setError, ...formProps } = useForm()
  const onSubmit = handleSubmit(async ({ email, password }) => {
    try {
      await signInWithEmailAndPassword(getAuth(), email, password)
    } catch (error) {
      console.error(error)
      setError(...loginError(error))
    }
  })
  return (
    <Page>
      <Paper sx={{ padding: 2 }} elevation={0}>
        <Typography variant='h6' component='h1' paragraph>
          Wishing you welcome back!
        </Typography>
        <AuthDetailsForm variant='login' onSubmit={onSubmit} {...formProps} />
      </Paper>
    </Page>
  )
}
