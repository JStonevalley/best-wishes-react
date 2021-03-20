import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr',
    gridTemplateRows: '100%',
    gridTemplateAreas: `
      ". . . c c c c c c . . ."
    `,
    [theme.breakpoints.down('sm')]: {
      gridTemplateAreas: `
        "c c c c c c c c c c c c"
      `
    },
    gap: theme.spacing(1, 1),
    margin: theme.spacing(1, 1),
    flexGrow: 1,
    overflowX: 'auto'
  }
}))

const ContentGrid = ({ children }) => {
  const classes = useStyles()
  return (
    <div className={classes.content}>
      <div
        style={{
          gridArea: 'c',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {children}
      </div>
    </div>
  )
}

export default ContentGrid
