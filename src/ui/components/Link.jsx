import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Link as MaterialLink } from '@material-ui/core'

export const Link = (props) => (
  <MaterialLink component={RouterLink} {...props} />
)
