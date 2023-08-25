import { createTheme } from '@mui/material/styles'
import { pink } from '@mui/material/colors'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: pink[500]
    }
  },
  spacing: 4
})

export default theme
