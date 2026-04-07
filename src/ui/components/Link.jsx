import { Link as MaterialLink } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

export const Link = (props) => <MaterialLink component={RouterLink} {...props} />
