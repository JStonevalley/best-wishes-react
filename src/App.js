import React, {Component} from 'react'
import './App.css'
import {Fabric} from 'office-ui-fabric-react/lib/Fabric';
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import {WishList} from './todos/components/WishList'
import {WishLists} from './todos/components/WishLists'

const MainAppBar = () => {
  return <AppBar position='static' color='primary'>
    <Toolbar>
      <Typography variant='title' color='inherit'>
        Things to do
      </Typography>
    </Toolbar>
  </AppBar>
}

const mainWrapperStyle = {display: 'flex', flexDirection: 'column'}
const centerContentWrapper = {display: 'flex', justifyContent: 'center'}
const contentWrapperStyle = {display: 'flex', flexDirection: 'column', maxWidth: '80rem', flexGrow: 1}
const MainWrapper = ({children}) => {
  return <Fabric>
    <div style={mainWrapperStyle}>
      <MainAppBar />
      <div style={centerContentWrapper}>
        <div style={contentWrapperStyle}>
          {children}
        </div>
      </div>
    </div>
  </Fabric>
}

class App extends Component {
  render () {
    return <MainWrapper>
      <WishLists
        style={{margin: '1rem'}}
      />
      <WishList
        style={{margin: '1rem'}}
      />
    </MainWrapper>
  }
}

export default App
