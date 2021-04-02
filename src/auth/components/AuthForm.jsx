import React from 'react'
import { Link } from '../../ui/components/Link'
import { makeStyles } from '@material-ui/core/styles'
import { Typography, TextField, Button } from '@material-ui/core'
import { materialUiFormRegister } from '../../tools/forms'

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
  error: {
    color: theme.palette.error.main,
    gridColumn: '1 / span 4',
    [theme.breakpoints.down('sm')]: {
      gridColumn: '1 / span 2'
    }
  },
  button: {
    gridColumn: '1 / span 2'
  },
  link: {
    alignSelf: 'center',
    gridColumn: '3 / span 2',
    [theme.breakpoints.down('sm')]: {
      gridColumn: '1 / span 2'
    }
  }
}))

const AuthDetailsForm = ({
  variant,
  onSubmit,
  register,
  formState: { errors }
}) => {
  const classes = useStyles()
  return (
    <form onSubmit={onSubmit} className={classes.form}>
      <TextField
        label='Email'
        variant='outlined'
        type='email'
        {...materialUiFormRegister(register)('email', {
          required: {
            value: true,
            message: 'Email is required'
          }
        })}
        error={Boolean(errors.email)}
        helperText={errors.email?.message}
        className={classes.input}
      />
      <TextField
        label='Password'
        variant='outlined'
        type='password'
        {...materialUiFormRegister(register)('password', {
          required: {
            value: true,
            message: 'Password is required'
          }
        })}
        error={Boolean(errors.password)}
        helperText={errors.password?.message}
        className={classes.input}
      />
      {errors.general && (
        <Typography className={classes.error}>
          {errors.general.message}
        </Typography>
      )}
      <Button variant='outlined' className={classes.button} type='submit'>
        {variant === 'login' ? 'Log in' : 'Sign up'}
      </Button>
      <Link
        to={variant === 'login' ? '/signup' : '/login'}
        className={classes.link}
      >
        {variant === 'login'
          ? 'Wish to create an account?'
          : 'Already have an account?'}
      </Link>
    </form>
  )
}

export default AuthDetailsForm
