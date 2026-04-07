import { useMutation } from '@apollo/client/react'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import { Button, Dialog, DialogContent, DialogTitle, IconButton, TextField } from '@mui/material'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { materialUiFormRegister } from '../../tools/forms'
import { CHANGE_WISH_LIST, CREATE_WISH_LIST, GET_OWN_WISH_LISTS } from '../gql'

const FormModal = ({ onSubmit, headline }) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm({ defaultValues: { headline } })
  const [createWishListFormOpen, setCreateWishListFormOpen] = useState(false)
  return (
    <>
      <IconButton onClick={() => setCreateWishListFormOpen(true)} size='large'>
        {headline ? <EditIcon /> : <AddIcon />}
      </IconButton>
      <Dialog open={createWishListFormOpen} onClose={() => setCreateWishListFormOpen(false)}>
        <DialogTitle>{headline ? 'Rename' : 'Create a'} wish list</DialogTitle>
        <DialogContent>
          <form style={{ display: 'flex', flexDirection: 'column' }}>
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
              onClick={handleSubmit(async (...args) => {
                // Needs to be explicitly called on on click since the component lives within a toolbar that calls event.PreventDefault()
                await onSubmit(...args)
                setCreateWishListFormOpen(false)
              })}
              color='success'
              sx={{ marginTop: 2 }}
              variant='outlined'
              type='button'
              disabled={isSubmitting}
            >
              {headline ? 'Rename' : 'Create'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export const CreateWishListFormModal = () => {
  const [createWishList] = useMutation(CREATE_WISH_LIST, {
    refetchQueries: [{ query: GET_OWN_WISH_LISTS }]
  })
  return (
    <FormModal
      onSubmit={({ headline }) => {
        return createWishList({
          variables: {
            headline
          }
        })
      }}
    />
  )
}

export const ChangeWishListFormModal = ({ headline, wishListId }) => {
  const [changeWishList] = useMutation(CHANGE_WISH_LIST)
  return (
    <FormModal
      headline={headline}
      onSubmit={({ headline }) => {
        return changeWishList({
          variables: {
            id: wishListId,
            headline
          }
        })
      }}
    />
  )
}
