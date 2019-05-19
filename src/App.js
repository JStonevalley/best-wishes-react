import React from 'react'
import './App.css'
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'
import { WishList } from './workshop/components/WishList'
import { WishLists } from './workshop/components/WishLists'
import { SharedWishList } from './shares/components/SharedWishList'
import { signOut } from './user/actions'
import { MEDIA_QUERIES } from './shared/ui'
import { SignIn, SignUp, ConfirmSignUp, SignInStatus } from './user/SignInUp'
import { Home } from './home/components/Home'

const styles = theme => ({
  signOutButtonText: {
    color: theme.palette.primary.contrastText,
    [MEDIA_QUERIES.PHONE]: {
      display: 'flex',
      flexDirection: 'column'
    }
  },
  userEmailText: {
    [MEDIA_QUERIES.PHONE]: {
      fontSize: '0.5em'
    }
  },
  titleLink: {
    textDecoration: 'none',
    color: theme.palette.primary.contrastText
  }
})

const MainAppBar = withStyles(styles)(({ classes }) => {
  const user = useSelector(state => state.user.cognito)
  return (
    <AppBar position='static' color='primary'>
      <Toolbar>
        <Link to='/' className={classes.titleLink}>
          <Typography variant='h6' color='inherit'>
            Best Wishes
          </Typography>
        </Link>
        <div style={{ flexGrow: 1 }} />
        {user && (
          <Button
            onClick={signOut}
            classes={{ label: classes.signOutButtonText }}
          >
            Sign out{' '}
            <span className={classes.userEmailText}>
              {user.attributes.email}
            </span>
          </Button>
        )}
      </Toolbar>
    </AppBar>
  )
})

const mainWrapperStyle = { display: 'flex', flexDirection: 'column' }
const centerContentWrapper = { display: 'flex', justifyContent: 'center' }
const contentWrapperStyle = {
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '80rem',
  flexGrow: 1
}
const MainWrapper = ({ children }) => {
  return (
    <BrowserRouter style={mainWrapperStyle}>
      <MainAppBar />
      <div style={centerContentWrapper}>
        <div style={contentWrapperStyle}>{children}</div>
      </div>
    </BrowserRouter>
  )
}

const App = () => {
  return (
    <MainWrapper>
      <Switch>
        <Route path='/workshop/wish-list/:wishListId' component={WishList} />
        <Route path='/workshop' component={WishLists} />
        <Route path='/shares/wish-list/:shareId' component={SharedWishList} />
        <Route path='/sign-up' component={SignUp} />
        <Route path='/sign-in' component={SignIn} />
        <Route path='/confirm-sign-up/' component={ConfirmSignUp} />
        <Route path='/' component={Home} />
      </Switch>
      <SignInStatus />
    </MainWrapper>
  )
}

export default App
