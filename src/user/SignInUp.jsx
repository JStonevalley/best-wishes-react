import React, { useEffect } from 'react'
import { Form, Field } from 'react-final-form'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { RegularTextField } from '../shared/FormFields'
import { required, email } from '../shared/FormValidators'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core'
import { Route } from 'react-router-dom'
import { signIn, signUp, confirmSignUp, isSignedIn } from './actions'

const styles = {
  wrapper: {
    display: 'flex',
    justifyContent: 'center'
  },
  paper: {
    margin: '1rem',
    flex: '0 1 30rem',
    padding: '1rem'
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column'
  }
}

const SignInUpForm = compose(
  connect(),
  withStyles(styles)
)(({ classes, onSubmit, validate, heading, buttonText, dispatch, history }) => {
  return (
    <div className={classes.wrapper}>
      <Paper className={classes.paper}>
        <Typography variant='h5' component='h2'>
          {heading}
        </Typography>
        <Form
          onSubmit={async values => {
            const redirectPath = await dispatch(onSubmit(values))
            history.push(redirectPath)
          }}
          validate={validate}
          render={({ handleSubmit }) => {
            return (
              <form onSubmit={handleSubmit} className={classes.flexColumn}>
                <Field
                  label='Email'
                  name='email'
                  validate={email}
                  component={RegularTextField}
                />
                <Field
                  label='Password'
                  name='password'
                  type='password'
                  validate={required}
                  component={RegularTextField}
                />
                <Button variant='text' color='primary' type='submit'>
                  {buttonText}
                </Button>
              </form>
            )
          }}
        />
      </Paper>
    </div>
  )
})

export const SignIn = () => (
  <Route
    path='/sign-in'
    render={props => (
      <SignInUpForm
        heading='Sign in to Best Wishes'
        buttonText='Sign in'
        onSubmit={signIn}
        {...props}
      />
    )}
  />
)

export const SignUp = () => (
  <Route
    path='/sign-up'
    render={props => (
      <SignInUpForm
        heading='Welcome! Sing up to Best Wishes'
        buttonText='Sign up'
        onSubmit={signUp}
        {...props}
      />
    )}
  />
)

const ConfirmSignUpForm = compose(
  connect(),
  withStyles(styles)
)(({ classes, dispatch, history }) => {
  return (
    <div className={classes.wrapper}>
      <Paper className={classes.paper}>
        <Typography variant='h5' component='h2'>
          Confirm email
        </Typography>
        <Form
          onSubmit={async values => {
            const redirectPath = await dispatch(confirmSignUp(values))
            history.push(redirectPath)
          }}
          render={({ handleSubmit }) => {
            return (
              <form onSubmit={handleSubmit} className={classes.flexColumn}>
                <Field
                  label='Email'
                  name='email'
                  validate={email}
                  component={RegularTextField}
                />
                <Field
                  label='Code'
                  name='code'
                  validate={required}
                  component={RegularTextField}
                />
                <Button variant='text' color='primary' type='submit'>
                  Confirm
                </Button>
              </form>
            )
          }}
        />
      </Paper>
    </div>
  )
})

export const ConfirmSignUp = () => (
  <Route
    path='/confirm-sign-up'
    render={props => <ConfirmSignUpForm {...props} />}
  />
)

const checkSignInStatus = async ({ dispatch, history }) => {
  if (!(await dispatch(isSignedIn()))) return history.push('/sign-in')
}

const SignInStatusChecker = connect()(({ history, dispatch }) => {
  useEffect(() => {
    checkSignInStatus({ history, dispatch })
  }, [])
  return null
})

export const SignInStatus = () => {
  return <Route path='/workshop' component={SignInStatusChecker} />
}
