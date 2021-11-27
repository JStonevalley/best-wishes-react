import { createTheme, adaptV4Theme } from '@mui/material/styles'
import { pink } from '@mui/material/colors'

const theme = createTheme(
  adaptV4Theme({
    palette: {
      mode: 'dark',
      primary: {
        main: pink[500]
      }
    },
    spacing: (...factors) =>
      factors.map((factor) => factor * 10).join('px ') + 'px'
  })
)

export default theme
