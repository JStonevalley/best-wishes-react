import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withStyles } from '@material-ui/core/styles'
import { PageHeading, LinkButton } from '../../shared/ui'
import Typography from '@material-ui/core/Typography'

const styles = theme => ({
  base: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '50rem',
    alignSelf: 'center'
  },
  bodyText: {
    margin: `${2 * theme.spacing.unit}px 0`
  },
  buttonsRow: {
    display: 'flex',
    justifyContent: 'center',
    margin: `${2 * theme.spacing.unit}px 0`
  },
  linkButton: {
    width: '10rem',
    margin: `${2 * theme.spacing.unit}px`
  }
})

export const Home = compose(
  connect(state => ({
    user: state.user.cognito
  })),
  withStyles(styles)
)(({ user, classes, history }) => {
  useEffect(
    () => {
      if (user) history.replace('/workshop')
    },
    [user]
  )
  return (
    <div className={classes.base}>
      <PageHeading heading='Best Wishes' />
      <Typography
        variant='headline'
        align='center'
        className={classes.bodyText}
      >
        Welcome to Best Wishes. Best wishes helps you create wish lists that are
        easily shared with friends and family. Everyone who the list is shared
        to are able to indicate what they have bought to the other gift givers.
        This way gift giving becomes stress free and duplicate gifts are a thing
        of the past.
      </Typography>
      <Typography variant='h4' component='h2' align='center'>
        Start by either creating an account or signing in to en existing one!
      </Typography>
      <div className={classes.buttonsRow}>
        <LinkButton
          to='/sign-in'
          variant='contained'
          color='primary'
          size='large'
          buttonClassName={classes.linkButton}
        >
          Sign in
        </LinkButton>
        <LinkButton
          to='/sign-up'
          variant='outlined'
          color='primary'
          size='large'
          buttonClassName={classes.linkButton}
        >
          Sign up
        </LinkButton>
      </div>
    </div>
  )
})
