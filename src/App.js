import React from 'react'
import firebase from 'firebase'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { CssBaseline, ThemeProvider } from '@material-ui/core'
import { Signup, Login } from './auth/AuthPages'
import ContentGrid from './ui/components/ContentGrid'
import BottomNav from './ui/components/BottomNav'
import theme from './theme'
import AppBar from './ui/components/AppBar'

const firebaseConfig = {
  apiKey: 'AIzaSyAUXoQex0Q_2Ln0yZSoSxQ2wsd7UKvnDJc',
  authDomain: 'bestwishes-ab288.firebaseapp.com',
  projectId: 'bestwishes-ab288',
  storageBucket: 'bestwishes-ab288.appspot.com',
  messagingSenderId: '680661551723',
  appId: '1:680661551723:web:b68f41f4605d92ec513f2e'
}

firebase.initializeApp(firebaseConfig)

function App() {
  return (
    <ThemeProvider theme={theme} style={{ minHeight: '100vh', width: '100%' }}>
      <CssBaseline />
      <BrowserRouter>
        <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <AppBar />
          <ContentGrid>
            <Switch>
              <Route path='/signup'>
                <Signup />
              </Route>
              <Route path='/login'>
                <Login />
              </Route>
              <Route path='/'>
                <div>Home</div>
              </Route>
            </Switch>
          </ContentGrid>
          <BottomNav />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
