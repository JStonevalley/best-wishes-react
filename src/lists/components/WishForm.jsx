import React, { useState } from 'react'
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
import { useWishMaking } from '../wishMaking'

const useStyles = makeStyles((theme) => ({
  dialogContent: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr',
    gridTemplateAreas: `
      "introText introText introText introText introText introText introText introText"
      "link link link link link link link rfb"
      "title title title title title title title title"
      "description description description description description description description description"
      "price price quantity quantity image image image image"
    `,
    [theme.breakpoints.down('sm')]: {
      gridTemplateAreas: `
        "introText introText introText introText introText introText introText introText"
        "link link link link link link link rfb"
        "title title title title title title title title"
        "description description description description description description description description"
        "price price price price quantity quantity quantity quantity"
        "image image image image image image image image"
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
  wishId,
  listId,
  close,
  hookFormProps: {
    watch,
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    ...hookFormProps
  }
}) => {
  const classes = useStyles()
  const [fetchingMetadata, setFetchingMetadata] = useState(false)
  const [fetchedMetadata, setFetchedMetadata] = useState(false)
  const [title, link] = watch(['title', 'link'])
  const { makeAWish, changeAWish } = useWishMaking()
  const submit = handleSubmit(async (data) => {
    try {
      wishId ? changeAWish(wishId)(data) : makeAWish(listId)(data)
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
                setFetchedMetadata(true)
                if (pageMetadata?.title) {
                  setValue('title', pageMetadata?.title, {
                    shouldTouch: true,
                    shouldDirty: true
                  })
                }
                if (pageMetadata?.description) {
                  setValue('description', pageMetadata?.description, {
                    shouldTouch: true,
                    shouldDirty: true
                  })
                }
                if (pageMetadata?.price) {
                  setValue('price', pageMetadata?.price, {
                    shouldTouch: true,
                    shouldDirty: true
                  })
                }
                if (pageMetadata?.image) {
                  setValue('image', pageMetadata?.image, {
                    shouldTouch: true,
                    shouldDirty: true
                  })
                }
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
            className={!wishId && !fetchedMetadata ? classes.hide : undefined}
            {...materialUiFormRegister(register)('title', {
              required: 'Required'
            })}
            error={Boolean(errors.title)}
            helperText={errors.title?.message}
          />
          <TextField
            label='Description'
            variant='outlined'
            multiline
            rows={4}
            style={{ gridArea: 'description' }}
            className={!wishId && !fetchedMetadata ? classes.hide : undefined}
            {...materialUiFormRegister(register)('description')}
          />
          <TextField
            label='Price'
            variant='outlined'
            type='number'
            style={{ gridArea: 'price' }}
            className={!wishId && !fetchedMetadata ? classes.hide : undefined}
            {...materialUiFormRegister(register)('price', {
              valueAsNumber: true
            })}
          />
          <TextField
            label='Image'
            variant='outlined'
            style={{ gridArea: 'image' }}
            className={!wishId && !fetchedMetadata ? classes.hide : undefined}
            {...materialUiFormRegister(register)('image')}
          />
          <TextField
            label='Quantity'
            variant='outlined'
            type='number'
            style={{ gridArea: 'quantity' }}
            className={!wishId && !fetchedMetadata ? classes.hide : undefined}
            {...materialUiFormRegister(register)('quantity', {
              required: 'Required',
              valueAsNumber: true
            })}
            error={Boolean(errors.quantity)}
            helperText={errors.quantity?.message}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={close}>Cancel</Button>
        {(wishId || fetchedMetadata) && (
          <Button onClick={submit} color='primary'>
            {!wishId ? 'Make my wish' : 'Change my wish'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default WishFormModal
