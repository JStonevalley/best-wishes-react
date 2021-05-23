import React, { useState } from 'react'
import firebase from 'firebase/app'
import 'firebase/firestore'
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
      "title title title title title title title title"
      "description description description description description description description description"
      "price price image image image image image image"
    `,
    [theme.breakpoints.down('sm')]: {
      gridTemplateAreas: `
        "introText introText introText introText introText introText introText introText"
        "link link link link link link link rfb"
        "title title title title title title title title"
        "description description description description description description description description"
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
  },
  '@keyframes roll': {
    from: {
      transform: 'rotate(0)'
    },
    to: {
      transform: 'rotate(360deg)'
    }
  },
  loading: {
    animation: '$roll 2s infinite'
  }
}))

const WishFormModal = ({
  isOpen,
  formMode,
  close,
  hookFormProps: { watch, register, formState, handleSubmit, ...hookFormProps }
}) => {
  const classes = useStyles()
  const [fetchingMetadata, setFetchingMetadata] = useState(false)
  const [title, link] = watch(['title', 'link'])
  const submit = handleSubmit(async (data) => {
    try {
      console.log('SUBMIT', data)
      firebase.firestore().collection('wish')
      close()
    } catch (error) {
      console.error(error)
    }
  })
  return (
    <Dialog open={isOpen} onClose={close}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <form onSubmit={submit} className={classes.dialogContent}>
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
          <IconButton
            style={{ gridArea: 'rfb' }}
            disabled={fetchingMetadata}
            onClick={async () => {
              setFetchingMetadata(true)
              try {
                const pageMetadata = await fetch(
                  `${process.env.REACT_APP_API_BASE}/fetchPageMetadata`,
                  {
                    method: 'POST', // *GET, POST, PUT, DELETE, etc.
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ url: link })
                  }
                ).then((res) => res.json())
                console.log(pageMetadata)
              } catch (error) {
                console.error(error)
              }
              setFetchingMetadata(false)
            }}
          >
            <RefreshIcon
              className={fetchingMetadata ? classes.loading : undefined}
            />
          </IconButton>
          <TextField
            label='Title'
            variant='outlined'
            style={{ gridArea: 'title' }}
            className={formMode === 'create' ? classes.hide : undefined}
            {...materialUiFormRegister(register)('title')}
          />
          <TextField
            label='Description'
            variant='outlined'
            multiline
            rows={4}
            style={{ gridArea: 'description' }}
            className={formMode === 'create' ? classes.hide : undefined}
            {...materialUiFormRegister(register)('description')}
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
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={close}>Cancel</Button>
        <Button onClick={submit} color='primary'>
          {formMode === 'create' ? 'Make my wish' : 'Change my wish'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default WishFormModal
