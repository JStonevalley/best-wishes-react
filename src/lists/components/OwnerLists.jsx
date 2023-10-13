import React from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { ARCHIVE_WISH_LIST, GET_OWN_WISH_LISTS, UNARCHIVE_WISH_LIST } from '../gql'
import { WishListListItem } from './WishListsPresentation'
import { Paper, Typography, List, Accordion, AccordionSummary, AccordionDetails, CircularProgress } from '@mui/material'
import Box from '@mui/material/Box'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { CreateWishListFormModal } from './WishListForm'

const ListHeader = ({ headline }) => {
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

export const OwnerLists = () => {
  const { data: wishListsData, loading } = useQuery(GET_OWN_WISH_LISTS)
  const [archiveWishList, { loading: loadingArchive }] = useMutation(ARCHIVE_WISH_LIST)
  const [unarchiveWishList, { loading: loadingUnarchive }] = useMutation(UNARCHIVE_WISH_LIST)
  const activeWishLists = wishListsData?.wishLists?.filter((wishList) => !wishList.archivedAt)
  const achivedWishLists = wishListsData?.wishLists?.filter((wishList) => wishList.archivedAt)
  return (
    <>
      <Paper sx={{ padding: 2, display: 'flex', flexDirection: 'column' }}>
        <ListHeader headline='My Lists' />
        {loading && <CircularProgress sx={{ alignSelf: 'center' }} />}
        {!loading && !achivedWishLists?.length && !activeWishLists?.length && (
          <Typography sx={{ margin: 3 }}>You have not created any wish lists yet. Get started!</Typography>
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
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='archived-lists-header' id='archived-lists-header'>
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
