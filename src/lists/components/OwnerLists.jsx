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
  AccordionDetails,
  CircularProgress
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { materialUiFormRegister } from '../../tools/forms'
import { Route, Routes } from 'react-router-dom'
import { OwnerList } from './List'

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
  const { data: wishListsData, loading } = useQuery(GET_OWN_WISH_LISTS)
  const [archiveWishList, { loading: loadingArchive }] = useMutation(
    ARCHIVE_WISH_LIST
  )
  const [unarchiveWishList, { loading: loadingUnarchive }] = useMutation(
    UNARCHIVE_WISH_LIST
  )
  const activeWishLists = wishListsData?.wishLists?.filter(
    (wishList) => !wishList.archivedAt
  )
  const achivedWishLists = wishListsData?.wishLists?.filter(
    (wishList) => wishList.archivedAt
  )
  return (
    <>
      <Routes>
        <Route path=':listId' element={<OwnerList />} />
      </Routes>
      <Paper sx={{ padding: 2, display: 'flex', flexDirection: 'column' }}>
        <ListHeader headline='My Lists' />
        {loading && <CircularProgress sx={{ alignSelf: 'center' }} />}
        {!loading &&
          !Boolean(achivedWishLists?.length) &&
          !Boolean(activeWishLists?.length) && (
            <Typography sx={{ margin: 3 }}>
              You have not created any wish lists yet. Get started!
            </Typography>
          )}
        {Boolean(activeWishLists?.length) && (
          <List>
            {activeWishLists.map((wishList) => (
              <WishListListItem
                key={wishList.id}
                wishList={wishList}
                archiveWishList={archiveWishList}
                loading={loadingArchive || loadingUnarchive}
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
                    loading={loadingArchive || loadingUnarchive}
                  />
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        )}
      </Paper>
    </>
  )
}
