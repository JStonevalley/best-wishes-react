import * as React from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

export const CircularProgressWithLabel = React.forwardRef(
  ({ label, value, ...props }, ref) => {
    return (
      <Box
        ref={ref}
        {...props}
        sx={{ position: 'relative', display: 'inline-flex' }}
      >
        <CircularProgress variant='determinate' value={value} />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Typography variant='caption' component='div' color='text.secondary'>
            {label}
          </Typography>
        </Box>
      </Box>
    )
  }
)
