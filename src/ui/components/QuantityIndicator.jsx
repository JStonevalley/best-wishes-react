import * as React from 'react'
import Box from '@mui/material/Box'
import { blue } from '@mui/material/colors'

export const QuantityIndicator = React.forwardRef(
  ({ amountClaimedByOthers, amountClaimedByYou, total, sx, ...props }, ref) => {
    const indicators = Array.from({ length: total }, (_, index) => ({
      color:
        index < amountClaimedByOthers
          ? `error.main`
          : index >= total - amountClaimedByYou
          ? 'success.main'
          : `${blue[500]}`,
      opacity: index < amountClaimedByOthers ? 1 : 0.5
    }))
    return (
      <Box
        ref={ref}
        sx={{ height: '6px', display: 'flex', flexDirection: 'row', ...sx }}
        {...props}
      >
        {indicators.map(({ color, opacity }, index) => (
          <Box
            key={index}
            sx={{
              width: '6px',
              borderRadius: '3px',
              marginLeft: index === 0 ? 0 : '2px',
              height: '100%',
              backgroundColor: color,
              opacity: opacity
            }}
          />
        ))}
      </Box>
    )
  }
)
