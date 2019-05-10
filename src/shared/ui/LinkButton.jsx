import React from 'react'
import { Link } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core'
import classnames from 'classnames'

const styles = {
  base: {
    textDecoration: 'none'
  }
}

export const LinkButton = withStyles(styles)(
  ({ classes, to, className, buttonClassName, ...props }) => {
    return (
      <Link to={to} className={classnames(className, classes.base)}>
        <Button className={buttonClassName} {...props} />
      </Link>
    )
  }
)
