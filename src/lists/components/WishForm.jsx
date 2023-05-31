import React, { useState } from 'react'
import { styled } from '@mui/system'
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton
} from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'
import { materialUiFormRegister } from '../../tools/forms'
import { useWishMaking } from '../wishMaking'
import { CHANGE_A_WISH, MAKE_A_WISH } from '../gql'
import { useMutation } from '@apollo/client'

const GridForm = styled('form')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr',
  gridTemplateAreas: `
    "introText introText introText introText introText introText introText introText"
    "link link link link link link link rfb"
    "title title title title title title title title"
    "description description description description description description description description"
    "price price quantity quantity image image image image"
  `,
  [theme.breakpoints.down('md')]: {
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
  const [fetchingMetadata, setFetchingMetadata] = useState(false)
  const [fetchedMetadata, setFetchedMetadata] = useState(false)
  const [title, link] = watch(['title', 'link'])
  const [makeAWish] = useMutation(MAKE_A_WISH, {
    refetchQueries: [`getOwnWishList({"id":"${listId}"})`]
  })
  const [changeAWish] = useMutation(CHANGE_A_WISH)
  const submit = handleSubmit(async (data) => {
    try {
      wishId
        ? changeAWish({ variables: { id: wishId, ...data } })
        : makeAWish({ variables: { wishListId: listId, ...data } })
      close()
    } catch (error) {
      console.error(error)
    }
  })
  const hideOrDisplayInputFields =
    !wishId && !fetchedMetadata ? { display: 'none' } : {}
  return (
    <Dialog open={isOpen} onClose={close}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <GridForm onSubmit={submit}>
          <DialogContentText sx={{ gridArea: 'introText' }}>
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
            size='large'
          >
            <RefreshIcon
              style={
                fetchingMetadata ? { animation: 'roll infinite 2s' } : undefined
              }
              className='Roll'
            />
          </IconButton>
          <TextField
            label='Title'
            variant='outlined'
            style={{ gridArea: 'title', ...hideOrDisplayInputFields }}
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
            style={{ gridArea: 'description', ...hideOrDisplayInputFields }}
            {...materialUiFormRegister(register)('description')}
          />
          <TextField
            label='Price'
            variant='outlined'
            type='number'
            style={{ gridArea: 'price', ...hideOrDisplayInputFields }}
            {...materialUiFormRegister(register)('price', {
              valueAsNumber: true
            })}
          />
          <TextField
            label='Image'
            variant='outlined'
            style={{ gridArea: 'image', ...hideOrDisplayInputFields }}
            {...materialUiFormRegister(register)('image')}
          />
          <TextField
            label='Quantity'
            variant='outlined'
            type='number'
            style={{ gridArea: 'quantity', ...hideOrDisplayInputFields }}
            {...materialUiFormRegister(register)('quantity', {
              required: 'Required',
              valueAsNumber: true
            })}
            error={Boolean(errors.quantity)}
            helperText={errors.quantity?.message}
          />
        </GridForm>
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
