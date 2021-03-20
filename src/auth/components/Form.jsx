import React from 'react'
import { Link } from '../../ui/components/Link'
import { makeStyles } from '@material-ui/core/styles'
import { TextField, Button } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  form: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 1fr',
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '1fr 1fr'
    },
    gridTemplateRows: 'auto',
    gap: theme.spacing(1, 1)
  },
  input: {
    gridColumn: 'span 2'
  },
  submitButton: {
    gridColumn: '2 / span 2',
    [theme.breakpoints.down('sm')]: {
      gridColumn: '1 / span 2'
    }
  }
}))

const AuthDetailsForm = ({ variant, onSubmit, register, errors }) => {
  const classes = useStyles()
  return (
    <form onSubmit={onSubmit} className={classes.form}>
      <TextField
        label='Email'
        variant='outlined'
        type='email'
        name='email'
        inputProps={{
          ref: register({
            required: {
              value: true,
              message: 'Email is required'
            }
          })
        }}
        error={Boolean(errors.email)}
        helperText={errors.email?.message}
        className={classes.input}
      />
      <TextField
        label='Password'
        variant='outlined'
        type='password'
        name='password'
        inputProps={{
          ref: register({
            required: {
              value: true,
              message: 'Password is required'
            }
          })
        }}
        error={Boolean(errors.password)}
        helperText={errors.password?.message}
        className={classes.input}
      />
      <Button variant='outlined' className={classes.submitButton} type='submit'>
        {variant === 'login' ? 'Log in' : 'Sign up'}
      </Button>
      <Link
        to={variant === 'login' ? '/signup' : '/login'}
        className={classes.submitButton}
      >
        {variant === 'login'
          ? 'Wish to create an account?'
          : 'Already have an account?'}
      </Link>
    </form>
  )
}

export default AuthDetailsForm
