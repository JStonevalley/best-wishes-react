import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import rootReducer from './reducer'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import pink from '@material-ui/core/colors/pink'
import cyan from '@material-ui/core/colors/cyan'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: pink.A100
    },
    secondary: {
      main: cyan[300]
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
registerServiceWorker()
