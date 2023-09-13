import React from 'react'
import { styled } from '@mui/system'

const OuterGrid = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr',
  gridTemplateRows: '100%',
  gridTemplateAreas: `
    ". . . c c c c c c . . ."
  `,
  [theme.breakpoints.down('lg')]: {
    gridTemplateAreas: `
      "c c c c c c c c c c c c"
    `
  },
  gridGap: theme.spacing(2, 2),
  margin: theme.spacing(2, 2),
  flexGrow: 1,
  overflowX: 'auto'
}))

const ContentGrid = ({ children }) => {
  return (
    <OuterGrid>
      <div
        style={{
          gridArea: 'c',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {children}
      </div>
    </OuterGrid>
  )
}

export default ContentGrid
