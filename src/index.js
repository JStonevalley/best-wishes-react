import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { unregister } from './registerServiceWorker'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import rootReducer from './reducer'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import deepOrange from '@material-ui/core/colors/deepOrange'
import cyan from '@material-ui/core/colors/cyan'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: cyan[300]
    },
    secondary: {
      main: deepOrange.A100
    }
  }
})

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
)

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <Provider store={store}>
      <App />
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('root')
)
unregister()
