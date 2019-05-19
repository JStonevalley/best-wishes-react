import * as React from 'react'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  root: {
    color: theme.palette.error.light
  }
})
export const DeleteIconButton = withStyles(styles)(props => (
  <IconButton {...props}>
    <DeleteIcon />
  </IconButton>
))
