import { Badge, Box, IconButton, Tooltip } from '@mui/material'
import React from 'react'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import RedeemIcon from '@mui/icons-material/Redeem'
import { useMutation } from '@apollo/client'
import { CLAIM_WISH, REMOVE_WISH_CLAIM } from '../../share/gql'
import { filter, join, mapObjIndexed, pipe } from 'ramda'
import { QuantityIndicator } from '../../ui/components/QuantityIndicator'

export const ClaimWish = ({ share, wishId, wishQuantity, claimedByEmail }) => {
  const [claimWish] = useMutation(CLAIM_WISH)
  const [removeWishClaim] = useMutation(REMOVE_WISH_CLAIM)
  const totalClaimedQuantity = Object.values(claimedByEmail).reduce(
    (total, quantity) => total + quantity,
    0
  )
  const amountClaimedByOthers =
    totalClaimedQuantity - claimedByEmail[share.invitedEmail] || 0
  const amountClaimedByYou = claimedByEmail[share.invitedEmail] || 0
  const tooltipTitle = pipe(
    filter((amountClaimed) => amountClaimed > 0),
    mapObjIndexed((quantity, email) => `${email}: ${quantity}`),
    Object.values,
    join(', ')
  )(claimedByEmail)
  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <IconButton
          onClick={() =>
            removeWishClaim({ variables: { id: share.id, wishId } })
          }
          disabled={amountClaimedByYou === 0}
          size='large'
        >
          <RemoveIcon />
        </IconButton>
        <Tooltip disableFocusListener title={tooltipTitle}>
          <Badge badgeContent={amountClaimedByYou} color='success'>
            <RedeemIcon />
          </Badge>
        </Tooltip>
        <IconButton
          onClick={() =>
            claimWish({ variables: { id: share.id, wishId } }).catch(
              console.error
            )
          }
          disabled={wishQuantity <= amountClaimedByOthers + amountClaimedByYou}
          size='large'
        >
          <AddIcon />
        </IconButton>
      </Box>
      <Tooltip disableFocusListener title={tooltipTitle}>
        <QuantityIndicator
          amountClaimedByOthers={amountClaimedByOthers}
          amountClaimedByYou={claimedByEmail[share.invitedEmail] || 0}
          total={wishQuantity}
        />
      </Tooltip>
    </Box>
  )
}
