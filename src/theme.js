import { createMuiTheme } from '@material-ui/core/styles'
import pink from '@material-ui/core/colors/pink'

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: pink[500]
    }
  },
  spacing: (...factors) =>
    factors.map((factor) => factor * 10).join('px ') + 'px'
})

export default theme
