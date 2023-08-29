import React from 'react'
import { useMutation, useQuery } from '@apollo/client'
import {
  ARCHIVE_WISH_LIST,
  CREATE_WISH_LIST,
  GET_OWN_WISH_LISTS,
  UNARCHIVE_WISH_LIST
} from '../gql'
import { WishListListItem } from './WishListsPresentation'
import {
  Paper,
  Typography,
  List,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
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
  const [archiveWishList] = useMutation(ARCHIVE_WISH_LIST)
  const [unarchiveWishList] = useMutation(UNARCHIVE_WISH_LIST)
  const activeWishLists = wishListsData?.wishLists?.filter(
    (wishList) => !wishList.archivedAt
  )
  const achivedWishLists = wishListsData?.wishLists?.filter(
    (wishList) => wishList.archivedAt
  )
  return (
    <Paper sx={{ padding: 2 }}>
      <ListHeader headline='My Lists' />
      {activeWishLists && (
        <List>
          {activeWishLists.map((wishList) => (
            <WishListListItem
              key={wishList.id}
              wishList={wishList}
              archiveWishList={archiveWishList}
            />
          ))}
        </List>
      )}
      {Boolean(achivedWishLists?.length) && (
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls='archived-lists-header'
            id='archived-lists-header'
          >
            <Typography>Archived lists</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              {achivedWishLists.map((wishList) => (
                <WishListListItem
                  key={wishList.id}
                  wishList={wishList}
                  unarchiveWishList={unarchiveWishList}
                />
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      )}
    </Paper>
  )
}
