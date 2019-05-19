import React, { useEffect } from 'react'
import { Form, Field } from 'react-final-form'
import { FORM_ERROR } from 'final-form'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { RegularTextField } from '../shared/FormFields'
import { required, email } from '../shared/FormValidators'
import Button from '@material-ui/core/Button'
import { Paper } from '../shared/ui'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core'
import { Route, Link } from 'react-router-dom'
import {
  signIn,
  signUp,
  confirmSignUp,
  isSignedIn,
  resendSignUp
} from './actions'

const styles = theme => ({
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
  },
  spacing: {
    marginTop: `${theme.spacing.unit}px`
  }
})

const SignInUpForm = compose(
  connect(),
  withStyles(styles)
)(
  ({
    classes,
    onSubmit,
    validate,
    heading,
    buttonText,
    link,
    dispatch,
    history
  }) => {
    return (
      <div className={classes.wrapper}>
        <Paper className={classes.paper}>
          <Typography variant='h5' component='h2'>
            {heading}
          </Typography>
          <Form
            onSubmit={async values => {
              try {
                const redirectPath = await dispatch(onSubmit(values))
                history.push(redirectPath)
              } catch (error) {
                if (error.code === 'UserNotConfirmedException') {
                }
                return { [FORM_ERROR]: error.message }
              }
            }}
            validate={validate}
            render={({ handleSubmit, submitError }) => {
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
                  {submitError && (
                    <Typography variant='body1' align='center' color='error'>
                      {submitError}
                    </Typography>
                  )}
                  <Button variant='text' color='primary' type='submit'>
                    {buttonText}
                  </Button>
                  <Link to={link.to} className={classes.spacing}>
                    <Typography variant='body1' align='center'>
                      {link.text}
                    </Typography>
                  </Link>
                </form>
              )
            }}
          />
        </Paper>
      </div>
    )
  }
)

export const SignIn = props => (
  <SignInUpForm
    heading='Sign in to Best Wishes'
    buttonText='Sign in'
    link={{
      to: '/sign-up',
      text: 'Don`t have an account? Sign up here!'
    }}
    onSubmit={signIn}
    {...props}
  />
)

export const SignUp = props => (
  <SignInUpForm
    heading='Welcome! Sing up to Best Wishes'
    buttonText='Sign up'
    link={{
      to: '/sign-in',
      text: 'Already have an account? Sign in here!'
    }}
    onSubmit={signUp}
    {...props}
  />
)

export const ConfirmSignUp = compose(
  connect(),
  withStyles(styles)
)(({ classes, dispatch, history, location: { state } }) => {
  return (
    <div className={classes.wrapper}>
      <Paper className={classes.paper}>
        <Typography variant='h5' component='h2'>
          Confirm email
        </Typography>
        <Typography variant='body1'>
          A confirmation email has been sent to: {state && state.email} Please
          check your inbox for the verification code and enter it below.
        </Typography>
        <Form
          onSubmit={async values => {
            try {
              const redirectPath = await dispatch(confirmSignUp(values))
              history.push(redirectPath)
            } catch (error) {
              return { [FORM_ERROR]: error.message }
            }
          }}
          initialValues={state}
          render={({ handleSubmit, values, submitError }) => {
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
                {submitError && (
                  <Typography variant='body1' align='center' color='error'>
                    {submitError}
                  </Typography>
                )}
                <Button variant='text' color='primary' type='submit'>
                  Confirm
                </Button>
                <Button
                  onClick={() => resendSignUp(values.email)}
                  variant='text'
                  color='secondary'
                  type='button'
                >
                  Resend confirmation email
                </Button>
              </form>
            )
          }}
        />
      </Paper>
    </div>
  )
})

const SignInStatusChecker = connect(state => ({
  user: state.user.cognito,
  signInTried: state.user.signInTried
}))(({ history, dispatch, location: { pathname }, user, signInTried }) => {
  useEffect(() => {
    dispatch(isSignedIn())
  }, [])
  useEffect(
    () => {
      if (pathname.startsWith('/workshop') && signInTried && !user) {
        history.replace('/sign-in')
      }
    },
    [user, signInTried, pathname]
  )
  return null
})

export const SignInStatus = () => {
  return <Route path='/' component={SignInStatusChecker} />
}
