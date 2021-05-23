import React, { useEffect } from 'react'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth'
import { makeStyles } from '@material-ui/core/styles'
import { Typography, Paper } from '@material-ui/core'
import { useForm } from 'react-hook-form'
import AuthDetailsForm from './components/AuthForm'
import { useUser } from '../store/user'

const useStyles = makeStyles((theme) => ({
  page: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(2)
  }
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
  const classes = useStyles()
  const user = useUser()
  useEffect(() => {
    if (user) history.push('/list')
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
    <div className={classes.page}>
      <Paper elevation={0} className={classes.paper}>
        <Typography variant='h6' component='h1' paragraph>
          Welcome, wish to create account?
        </Typography>
        <AuthDetailsForm variant='signin' onSubmit={onSubmit} {...formProps} />
      </Paper>
    </div>
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
  const classes = useStyles()
  const user = useUser()
  useEffect(() => {
    if (user) history.push('/lists')
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
    <div className={classes.page}>
      <Paper elevation={0} className={classes.paper}>
        <Typography variant='h6' component='h1' paragraph>
          Wishing you welcome back!
        </Typography>
        <AuthDetailsForm variant='login' onSubmit={onSubmit} {...formProps} />
      </Paper>
    </div>
  )
}
