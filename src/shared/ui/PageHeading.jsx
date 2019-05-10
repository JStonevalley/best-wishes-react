import React from 'react'
import Typography from '@material-ui/core/Typography'

export const PageHeading = ({ heading, subHeading }) => {
  return (
    <React.Fragment>
      <Typography
        style={{ marginTop: '3rem' }}
        align='center'
        variant='h3'
        component='h1'
      >
        {heading}
      </Typography>
      <Typography
        style={{ marginBottom: '1rem' }}
        align='center'
        variant='subtitle1'
      >
        {subHeading}
      </Typography>
    </React.Fragment>
  )
}
