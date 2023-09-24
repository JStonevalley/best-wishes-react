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
  IconButton,
  Select,
  InputLabel,
  MenuItem,
  FormControl
} from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'
import { materialUiFormRegister } from '../../tools/forms'
import { CHANGE_A_WISH, GET_OWN_WISH_LIST, MAKE_A_WISH } from '../gql'
import { useMutation } from '@apollo/client'
import { Controller } from 'react-hook-form'

const GridForm = styled('form')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr',
  gridTemplateAreas: `
    "introText introText introText introText introText introText introText introText"
    "link link link link link link link rfb"
    "title title title title title title title title"
    "description description description description description description description description"
    "price_amount price_amount price_amount price_currency price_currency price_currency quantity quantity"
    "image image image image image image image image"
  `,
  [theme.breakpoints.down('lg')]: {
    gridTemplateAreas: `
      "introText introText introText introText introText introText introText introText"
      "link link link link link link link rfb"
      "title title title title title title title title"
      "description description description description description description description description"
      "price_amount price_amount price_amount price_amount price_currency price_currency price_currency price_currency"
      "quantity quantity image image image image image image"
    `
  },
  gridGap: theme.spacing(2, 2)
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
    control,
    ...hookFormProps
  }
}) => {
  const [fetchingMetadata, setFetchingMetadata] = useState(false)
  const [fetchedMetadata, setFetchedMetadata] = useState(false)
  const [title, link] = watch(['title', 'link'])
  const [makeAWish, { loading: loadingMakeAWish }] = useMutation(MAKE_A_WISH, {
    refetchQueries: [{ query: GET_OWN_WISH_LIST, variables: { id: listId } }]
  })
  const [changeAWish, { loading: loadingChangeAWish }] = useMutation(
    CHANGE_A_WISH
  )
  const loading = loadingMakeAWish || loadingChangeAWish
  const submit = handleSubmit(async (data) => {
    if (data.price?.amount != null) data.price.amount = data.price.amount * 100
    if (data.price?.amount == null || data.price?.currency) delete data.price
    try {
      await (wishId
        ? changeAWish({ variables: { id: wishId, ...data } })
        : makeAWish({ variables: { wishListId: listId, ...data } }))
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
                  `${import.meta.env.VITE_API_BASE}/fetchPageMetadata`,
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
            style={{ gridArea: 'price_amount', ...hideOrDisplayInputFields }}
            {...materialUiFormRegister(register)('price.amount', {
              valueAsNumber: true
            })}
          />
          <FormControl
            style={{ gridArea: 'price_currency', ...hideOrDisplayInputFields }}
          >
            <InputLabel id='price_currency_select_label'>Currency</InputLabel>
            <Controller
              control={control}
              name='price.currency'
              render={({ field }) => (
                <Select
                  {...field}
                  id='price_currency_select'
                  label='Currency'
                  labelId='price_currency_select_label'
                >
                  <MenuItem value='SEK'>SEK</MenuItem>
                  <MenuItem value='EUR'>EUR</MenuItem>
                  <MenuItem value='USD'>USD</MenuItem>
                  <MenuItem value='GBP'>GBP</MenuItem>
                </Select>
              )}
            />
          </FormControl>

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
        <Button onClick={close} disabled={loading}>
          Cancel
        </Button>
        {(wishId || fetchedMetadata) && (
          <Button onClick={submit} disabled={loading} color='primary'>
            {!wishId ? 'Make my wish' : 'Change my wish'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default WishFormModal
