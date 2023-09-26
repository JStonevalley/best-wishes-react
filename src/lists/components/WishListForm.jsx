import { useMutation } from '@apollo/client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { materialUiFormRegister } from '../../tools/forms'
import { CREATE_WISH_LIST, GET_OWN_WISH_LISTS } from '../gql'
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'

export const CreateWishListFormModal = () => {
  const [createWishList] = useMutation(CREATE_WISH_LIST, {
    refetchQueries: [{ query: GET_OWN_WISH_LISTS }]
  })
  const [createWishListFormOpen, setCreateWishListFormOpen] = useState(false)
  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm()
  return (
    <>
      <IconButton onClick={() => setCreateWishListFormOpen(true)} size='large'>
        <AddIcon />
      </IconButton>
      <Dialog
        open={createWishListFormOpen}
        onClose={() => setCreateWishListFormOpen(false)}
      >
        <DialogTitle>Create a wish list</DialogTitle>
        <DialogContent>
          <form
            style={{ display: 'flex', flexDirection: 'column' }}
            onSubmit={handleSubmit(({ headline }) =>
              createWishList({ variables: { headline } }).then(() =>
                setCreateWishListFormOpen(false)
              )
            )}
          >
            <TextField
              label='Headline'
              variant='outlined'
              {...materialUiFormRegister(register)('headline', {
                required: {
                  value: true,
                  message: 'Headline is required'
                }
              })}
              error={Boolean(errors.headline)}
              helperText={errors.headline?.message}
              sx={{ marginTop: 2 }}
            />
            <Button
              color='success'
              sx={{ marginTop: 2 }}
              variant='outlined'
              type='submit'
            >
              Create
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
