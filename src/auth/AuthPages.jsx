import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Typography, Paper } from '@material-ui/core'
import { useForm } from 'react-hook-form'
import AuthDetailsForm from './components/Form'

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

export const Signup = () => {
  const classes = useStyles()
  const { handleSubmit, watch, ...formProps } = useForm()
  const onSubmit = handleSubmit((data) => console.log(data))
  console.log(watch('email'), watch('password'))
  return (
    <div className={classes.page}>
      <Paper elevation={0} className={classes.paper}>
        <Typography variant='h6' component='h1' paragraph>
          Welcome, wish for an account?
        </Typography>
        <AuthDetailsForm variant='signin' onSubmit={onSubmit} {...formProps} />
      </Paper>
    </div>
  )
}

export const Login = () => {
  const classes = useStyles()
  const { handleSubmit, watch, ...formProps } = useForm()
  const onSubmit = handleSubmit((data) => console.log(data))
  console.log(watch('email'), watch('password'))
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
