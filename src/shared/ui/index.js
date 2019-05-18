import React from 'react'
import MaterialPaper from '@material-ui/core/Paper'
export { PageHeading } from './PageHeading'
export { LinkButton } from './LinkButton'
export { ActionFormDialog } from './ActionFormDialog'

const Paper = props => <MaterialPaper elevation={1} {...props} />

const MEDIA_QUERIES = Object.freeze({
  PHONE: '@media (max-width: 450px)'
})

export { Paper, MEDIA_QUERIES }
