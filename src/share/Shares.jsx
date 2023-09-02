import React from 'react'
import { useQuery } from '@apollo/client'
import { WishListListItem } from '../lists/components/WishListsPresentation'
import { GET_OWN_SHARES } from './gql'
import {
  Paper,
  Typography,
  List,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

export const OwnerShares = () => {
  const { data: sharesData, loading } = useQuery(GET_OWN_SHARES)
  const activeShares = sharesData?.shares?.filter(
    (share) => !share.wishList.archivedAt
  )
  const achivedShares = sharesData?.shares?.filter(
    (share) => share.wishList.archivedAt
  )
  return (
    <Paper sx={{ padding: 2, display: 'flex', flexDirection: 'column' }}>
      <Typography
        component='h1'
        variant='h4'
        sx={{ marginTop: 3, marginLeft: 3, marginRight: 3 }}
      >
        Shared with me
      </Typography>
      {loading && <CircularProgress sx={{ alignSelf: 'center' }} />}
      {!loading &&
        !Boolean(achivedShares?.length) &&
        !Boolean(activeShares?.length) && (
          <Typography sx={{ margin: 3 }}>
            Nothing has been shared with you yet
          </Typography>
        )}
      {Boolean(activeShares?.length) && (
        <List>
          {activeShares.map(({ id: shareId, wishList }) => (
            <WishListListItem
              key={shareId}
              shareId={shareId}
              wishList={wishList}
            />
          ))}
        </List>
      )}
      {Boolean(achivedShares?.length) && (
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls='archived-shares-header'
            id='archived-shares-header'
          >
            <Typography>Archived shares</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              {achivedShares.map(({ id: shareId, wishList }) => (
                <WishListListItem
                  key={shareId}
                  shareId={shareId}
                  wishList={wishList}
                />
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      )}
    </Paper>
  )
}
