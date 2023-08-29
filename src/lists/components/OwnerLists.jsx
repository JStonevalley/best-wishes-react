import React from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { CREATE_WISH_LIST, GET_OWN_WISH_LISTS } from '../gql'
import { WishListListItem } from './WishListsPresentation'
import {
  Paper,
  Typography,
  List,
  Divider,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { materialUiFormRegister } from '../../tools/forms'

const CreateWishListFormModal = () => {
  const [createWishList] = useMutation(CREATE_WISH_LIST)
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

const ListHeader = ({ headline, createWishList }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: 3,
        marginLeft: 3,
        marginRight: 3
      }}
    >
      <Typography component='h1' variant='h4'>
        {headline}
      </Typography>
      <Box
        style={{
          display: 'flex'
        }}
      >
        <CreateWishListFormModal />
      </Box>
    </Box>
  )
}

export const OwnerLists = ({ wishLists, shares }) => {
  const { data: wishListsData } = useQuery(GET_OWN_WISH_LISTS)
  return (
    <Paper sx={{ padding: 2 }}>
      <ListHeader headline='My Lists' />
      {wishListsData?.wishLists && (
        <List>
          {wishListsData.wishLists.map((wishList) => (
            <WishListListItem key={wishList.id} wishList={wishList} />
          ))}
          <Divider variant='inset' component='li' />
        </List>
      )}
    </Paper>
  )
}
