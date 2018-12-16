import React from 'react'
import './App.css'
import { BrowserRouter, Route } from 'react-router-dom'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { WishList } from './workshop/components/WishList'
import { WishLists } from './workshop/components/WishLists'
import { signIn } from './shared/actions'
import { connect } from 'react-redux'
import { compose, lifecycle, branch, renderNothing } from 'recompose'

const MainAppBar = () => {
  return <AppBar position='static' color='primary'>
    <Toolbar>
      <Typography variant='title' color='inherit'>
        Best Wishes
      </Typography>
    </Toolbar>
  </AppBar>
}

const mainWrapperStyle = { display: 'flex', flexDirection: 'column' }
const centerContentWrapper = { display: 'flex', justifyContent: 'center' }
const contentWrapperStyle = { display: 'flex', flexDirection: 'column', maxWidth: '80rem', flexGrow: 1 }
const MainWrapper = ({ children }) => {
  return <BrowserRouter style={mainWrapperStyle}>
    <MainAppBar />
    <div style={centerContentWrapper}>
      <div style={contentWrapperStyle}>
        {children}
      </div>
    </div>
  </BrowserRouter>
}

const App = () => {
  return <MainWrapper>
    <Route path='/workshop' component={WishLists} />
    <Route path='/workshop/:wishListId' component={WishList} />
  </MainWrapper>
}

export default compose(
  connect(
    (state) => ({ user: state.shared.user })
  ),
  lifecycle({
    componentDidMount () {
      this.props.dispatch(signIn({ email: 'jonas.stendahl@outlook.com' }))
    }
  }),
  branch(
    ({ user }) => !user,
    renderNothing
  )
)(App)
