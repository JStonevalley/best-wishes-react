import React from 'react'
import { Link } from '../../ui/components/Link'
import { styled } from '@mui/system'
import { Button, TextField, Typography } from '@mui/material'
import { materialUiFormRegister } from '../../tools/forms'

const Form = styled('form')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr 1fr',
  [theme.breakpoints.down('lg')]: {
    gridTemplateColumns: '1fr 1fr'
  },
  gridTemplateRows: 'auto',
  gap: theme.spacing(2, 2)
}))

const StyledLink = styled(Link)(({ theme }) => ({
  alignSelf: 'center',
  gridColumn: '3 / span 2',
  [theme.breakpoints.down('lg')]: {
    gridColumn: '1 / span 2'
  }
}))

const ErrorTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.main,
  gridColumn: '1 / span 4',
  [theme.breakpoints.down('lg')]: {
    gridColumn: '1 / span 2'
  }
}))

const AuthDetailsForm = ({
  variant,
  onSubmit,
  register,
  formState: { errors }
}) => {
  return (
    <Form onSubmit={onSubmit}>
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
        sx={{ gridColumn: 'span 2' }}
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
        sx={{ gridColumn: 'span 2' }}
      />
      {errors.general && (
        <ErrorTypography>{errors.general.message}</ErrorTypography>
      )}
      <Button
        sx={{ gridColumn: '1 / span 2' }}
        variant='outlined'
        type='submit'
      >
        {variant === 'login' ? 'Log in' : 'Sign up'}
      </Button>
      <StyledLink to={variant === 'login' ? '/signup' : '/login'}>
        {variant === 'login'
          ? 'Wish to create an account?'
          : 'Already have an account?'}
      </StyledLink>
    </Form>
  )
}

export default AuthDetailsForm
