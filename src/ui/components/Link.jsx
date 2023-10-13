import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Link as MaterialLink } from '@mui/material'

export const Link = (props) => <MaterialLink component={RouterLink} {...props} />
