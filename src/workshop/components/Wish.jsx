import * as React from 'react'
import { Link } from 'react-router-dom'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import LinkIcon from '@material-ui/icons/Link'
import Tooltip from '@material-ui/core/Tooltip'
import blue from '@material-ui/core/colors/blue'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import { connect } from 'react-redux'
import { deleteWish } from '../actions'
import { grantWish, revokeWish } from '../../shares/actions'

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  },
  frame: {
    display: 'flex',
    flexDirection: 'column'
  },
  toolBar: {
    alignSelf: 'stretch',
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  image: {
    width: '100%',
    objectFit: 'contain',
    borderRadius: '10px'
  },
  imageContainer: {
    alignSelf: 'center'
  },
  expander: {
    flexGrow: 1
  }
})

export const Wish = connect()(
  withStyles(styles)(({ wish, dispatch, classes, match: { url } }) => {
    return (
      <div className={classes.frame}>
        {wish.get('image') && (
          <div className={classes.imageContainer}>
            <img
              src={wish.get('image')}
              className={classes.image}
              alt='wish'
            />
          </div>
        )}
        <WishBody wish={wish} />
        <div style={{ flexGrow: 1 }} />
        <div className={classes.toolBar}>
          <Typography variant='subtitle1' inline>
            <b>Price:</b> {wish.get('price') || 'N/A'}
          </Typography>
          <div className={classes.expander} />
          <IconButton
            onClick={() => dispatch(deleteWish(wish.get('id')))}
            color='secondary'
          >
            <DeleteIcon />
          </IconButton>
          <Link to={`${url}/${wish.get('id')}`}>
            <IconButton>
              <EditIcon />
            </IconButton>
          </Link>
          <LinkIconButton
            href={wish.get('link')}
            disabled={!wish.get('link')}
          />
        </div>
      </div>
    )
  })
)

export const SharedWish = connect()(
  withStyles(styles)(({ wish, shares, activeShare, dispatch, classes }) => {
    const grantedByActiveUser = activeShare
      .get('grantedWishes')
      .includes(wish.get('id'))
    const grantedByOtherUser = shares
      .filter(share => share.get('id') !== activeShare.get('id'))
      .find(share => share.get('grantedWishes').includes(wish.get('id')))
    return (
      <div className={classes.frame}>
        <div className={classes.container}>
          {wish.get('image') && (
            <a href={wish.get('link')} target='_blank'>
              <div className={classes.imageContainer}>
                <img
                  src={wish.get('image')}
                  className={classes.image}
                  alt='wish'
                />
              </div>
            </a>
          )}
          <WishBody wish={wish} />
        </div>
        <div style={{ flexGrow: 1 }} />
        <div className={classes.toolBar}>
          <Typography variant='subtitle1' inline>
            <b>Price:</b> {wish.get('price') || 'N/A'}
          </Typography>
          <div className={classes.expander} />
          <FormControlLabel
            control={
              <Switch
                checked={grantedByActiveUser || grantedByOtherUser}
                disabled={grantedByOtherUser}
                onChange={() =>
                  dispatch(
                    grantedByActiveUser
                      ? revokeWish({
                        shareId: activeShare.get('id'),
                        wishId: wish.get('id')
                      })
                      : grantWish({
                        shareId: activeShare.get('id'),
                        wishId: wish.get('id')
                      })
                  )
                }
                value={`${wish.get('id')}-bought`}
                color='primary'
              />
            }
            label={
              grantedByOtherUser
                ? `Bought by ${grantedByOtherUser.get('sharedTo')}`
                : grantedByActiveUser
                  ? 'Bought by you'
                  : 'Mark as bought'
            }
          />
          <LinkIconButton
            href={wish.get('link')}
            disabled={!wish.get('link')}
          />
        </div>
      </div>
    )
  })
)

const bodyStyles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column'
  }
}

const WishBody = withStyles(bodyStyles)(({ classes, wish }) => {
  return (
    <div className={classes.wrapper}>
      <Typography variant='h6'>{wish.get('title')}</Typography>
      <Typography variant='subtitle1'>{wish.get('body')}</Typography>
    </div>
  )
})

const linkButtonStyles = theme => ({
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

export const LinkTextButton = withStyles(linkButtonStyles)(
  ({ classes, children, ...props }) => {
    return (
      <Button className={classes.linkButton} size='small' {...props}>
        {children}
        <LinkIcon className={classes.margin} />
      </Button>
    )
  }
)

const LinkIconButton = withStyles(linkButtonStyles)(
  ({ classes, children, href, newTab = true, ...props }) => {
    return (
      <Tooltip title={href}>
        <IconButton
          className={classes.linkButton}
          href={href}
          target={newTab ? '_blank' : '_self'}
          {...props}
        >
          <LinkIcon />
        </IconButton>
      </Tooltip>
    )
  }
)
