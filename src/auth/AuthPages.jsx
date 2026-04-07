import { useMutation } from '@apollo/client/react'
import { Paper, Typography } from '@mui/material'
import { styled } from '@mui/system'
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth'
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import AuthDetailsForm from './components/AuthForm'
import { CREATE_USER } from './gql'

const waitForLoggedInAuthState = () =>
  new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        unsubscribe()
        resolve()
      }
    })
  })

const Page = styled('div')(() => ({
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
      return ['general', { type: 'manual', code: error.code, message: error.message }]
  }
}

export const Signup = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [createUser] = useMutation(CREATE_USER)
  const { handleSubmit, setError, ...formProps } = useForm()
  const onSubmit = handleSubmit(async ({ email, password }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(getAuth(), email, password)
      const token = await userCredential.user.getIdToken()
      await createUser({ variables: { email }, context: { googleFirebaseUserIdToken: token } })
      navigate(location.state?.from || '/list')
    } catch (error) {
      console.error(error)
      setError(...signupError(error))
    }
  })
  return (
    <Page>
      <Paper sx={{ padding: 2 }} elevation={0}>
        <Typography variant='h6' component='h1' sx={{ marginBottom: '16px' }}>
          Welcome, wish to create account?
        </Typography>
        <Typography variant='subtitle1' component='h2' sx={{ marginBottom: '16px' }}>
          Best wishes is a simple wish list app that allows you to create and share wish lists with your friends and family.
          Gift givers can easily find items on your list and indicate to each other what they have bought. Stressfree shopping!
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
          message: 'Too many login attempts. Account temporarily blocked. Reset your password to login.'
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
      return ['general', { type: 'manual', code: error.code, message: error.message }]
  }
}

export const Login = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { handleSubmit, setError, ...formProps } = useForm()
  const onSubmit = handleSubmit(async ({ email, password }) => {
    try {
      await signInWithEmailAndPassword(getAuth(), email, password)
      await waitForLoggedInAuthState()
      navigate(location.state?.from || '/list')
    } catch (error) {
      console.error(error)
      setError(...loginError(error))
    }
  })
  return (
    <Page>
      <Paper sx={{ padding: 2 }} elevation={0}>
        <Typography variant='h6' component='h1' sx={{ marginBottom: '16px' }}>
          Wishing you welcome!
        </Typography>
        <AuthDetailsForm variant='login' onSubmit={onSubmit} {...formProps} />
      </Paper>
    </Page>
  )
}
