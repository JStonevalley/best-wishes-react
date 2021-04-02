import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton
} from '@material-ui/core'
import RefreshIcon from '@material-ui/icons/Refresh'
import { materialUiFormRegister } from '../../tools/forms'

const useStyles = makeStyles((theme) => ({
  dialogContent: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr',
    gridTemplateAreas: `
      "introText introText introText introText introText introText introText introText"
      "link link link link link link link rfb"
      "headline headline headline headline headline headline headline headline"
      "body body body body body body body body"
      "price price image image image image image image"
    `,
    [theme.breakpoints.down('sm')]: {
      gridTemplateAreas: `
        "introText introText introText introText introText introText introText introText"
        "link link link link link link link rfb"
        "headline headline headline headline headline headline headline headline"
        "body body body body body body body body"
        "price price image image image image image image"
      `
    },
    gridGap: theme.spacing(1, 1)
  },
  introText: {
    gridArea: 'introText'
  },
  hide: {
    display: 'none'
  }
}))

const WishFormModal = ({
  isOpen,
  formMode,
  close,
  hookFormProps: { watch, register, formState, ...hookFormProps }
}) => {
  const classes = useStyles()
  const [headline] = watch(['headline'])
  return (
    <Dialog open={isOpen} onClose={close}>
      <DialogTitle>{headline}</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <DialogContentText className={classes.introText}>
          To make wishing easier, paste a link in the field below and as much
          information as possible will be fetched for you.
        </DialogContentText>
        <TextField
          autoFocus
          label='Link'
          variant='outlined'
          style={{ gridArea: 'link' }}
          {...materialUiFormRegister(register)('link')}
        />
        <IconButton style={{ gridArea: 'rfb' }}>
          <RefreshIcon />
        </IconButton>
        <TextField
          label='Headline'
          variant='outlined'
          style={{ gridArea: 'headline' }}
          className={formMode === 'create' ? classes.hide : undefined}
          {...materialUiFormRegister(register)('headline')}
        />
        <TextField
          label='Body'
          variant='outlined'
          multiline
          style={{ gridArea: 'body' }}
          className={formMode === 'create' ? classes.hide : undefined}
          {...materialUiFormRegister(register)('body')}
        />
        <TextField
          label='Price'
          variant='outlined'
          type='number'
          style={{ gridArea: 'price' }}
          className={formMode === 'create' ? classes.hide : undefined}
          {...materialUiFormRegister(register)('price')}
        />
        <TextField
          label='Image'
          variant='outlined'
          style={{ gridArea: 'image' }}
          className={formMode === 'create' ? classes.hide : undefined}
          {...materialUiFormRegister(register)('image')}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={close} color='primary'>
          Cancel
        </Button>
        <Button onClick={close} color='primary'>
          Subscribe
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default WishFormModal
