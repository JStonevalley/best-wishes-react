import * as React from 'react'
import Box from '@mui/material/Box'
import { grey } from '@mui/material/colors'

export const QuantityIndicator = React.forwardRef(
  ({ amountClaimedByOthers, amountClaimedByYou, total, sx, ...props }, ref) => {
    const indicators = Array.from({ length: total }, (_, index) => ({
      color:
        index < amountClaimedByOthers
          ? `${grey[500]}`
          : index >= total - amountClaimedByYou
          ? 'success.main'
          : `primary.main`,
      opacity: index < amountClaimedByOthers ? 1 : 0.5
    }))
    return (
      <Box
        ref={ref}
        sx={{ height: '16px', display: 'flex', flexDirection: 'row', ...sx }}
        {...props}
      >
        {indicators.map(({ color, opacity }, index) => (
          <Box
            key={index}
            sx={{
              width: '4px',
              borderRadius: '1px',
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
