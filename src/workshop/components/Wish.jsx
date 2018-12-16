import * as React from 'react'
import { Link } from 'react-router-dom'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import LinkIcon from '@material-ui/icons/Link'
import blue from '@material-ui/core/colors/blue'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { deleteWish } from '../actions'

const styles = (theme) => ({
  button: {
    margin: theme.spacing.unit
  },
  frame: {
    display: 'flex',
    justifyContent: 'space-between',
    flexGrow: 1,
    padding: '2vw'
  },
  column: {
    display: 'flex',
    flexDirection: 'column'
  },
  rightAlign: {
    alignItems: 'flex-end'
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '50%'
  },
  imageContainer: {
    alignSelf: 'center',
    width: '10vw',
    height: '10vw'
  },
  container: {
    display: 'flex'
  }
})

export const Wish = connect()(withStyles(styles)(({ wish, dispatch, classes, match: { url, path } }) => {
  return <div className={classes.frame}>
    <div className={classes.container}>
      <div className={classes.imageContainer}>
        {wish.get('image') && <img src={wish.get('image')} className={classes.image} alt='wish' />}
      </div>
      <WishBody wish={wish} />
    </div>
    <div className={classNames(classes.column, classes.rightAlign)}>
      {wish.get('link') && <LinkIconButton href={wish.get('link')} />}
      <IconButton onClick={() => dispatch(deleteWish(wish.get('id')))} color='secondary'>
        <DeleteIcon />
      </IconButton>
      <Link to={`${url}/${wish.get('id')}`}>
        <IconButton>
          <EditIcon />
        </IconButton>
      </Link>
    </div>
  </div>
}))

const bodyStyles = {
  wrapper: {
    display: 'flex',
    margin: '1vw'
  },
  column: {
    display: 'flex',
    flexDirection: 'column'
  }
}

const WishBody = withStyles(bodyStyles)(({ classes, wish }) => {
  return <div className={classes.wrapper}>
    <div className={classes.column}>
      <Typography variant='h6'>{wish.get('title')}</Typography>
      <Typography variant='subtitle1'>{wish.get('body')}</Typography>
    </div>
    <div className={classes.column} />
  </div>
})

const linkButtonStyles = (theme) => ({
  linkButton: {
    color: blue[500],
    textDecoration: 'underline',
    '&:hover': {
      backgroundColor: blue[100],
      color: blue[700]
    }
  },
  margin: {
    margin: `0 ${theme.spacing.unit}px`
  }
})

export const LinkTextButton = withStyles(linkButtonStyles)(({ classes, children, ...props }) => {
  return <Button
    className={classes.linkButton}
    size='small'
    {...props}
  >
    {children}
    <LinkIcon className={classes.margin} />
  </Button>
})

const LinkIconButton = withStyles(linkButtonStyles)(({ classes, children, ...props }) => {
  return <IconButton
    className={classes.linkButton}
    {...props}
  >
    <LinkIcon />
  </IconButton>
})
