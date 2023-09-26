import React from 'react'
import { styled } from '@mui/system'
import { Badge, IconButton, Tooltip } from '@mui/material'
import Box from '@mui/material/Box'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import RedeemIcon from '@mui/icons-material/Redeem'
import { useMutation } from '@apollo/client'
import { CLAIM_WISH, REMOVE_WISH_CLAIM } from '../../share/gql'
import { filter, join, mapObjIndexed, pipe, when } from 'ramda'
import { QuantityIndicator } from '../../ui/components/QuantityIndicator'

const FRefQuantityIndicator = React.forwardRef(QuantityIndicator)

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: 12,
    top: 15,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px'
  }
}))

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
    when(
      () => totalClaimedQuantity < wishQuantity,
      (titleComponents) => [
        ...titleComponents,
        `Available: ${wishQuantity - totalClaimedQuantity}`
      ]
    ),
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
        <Tooltip
          disableFocusListener
          enterTouchDelay={0}
          title={tooltipTitle}
          leaveTouchDelay={5000}
        >
          <StyledBadge badgeContent={amountClaimedByYou} color='success'>
            <IconButton size='large'>
              <RedeemIcon />
            </IconButton>
          </StyledBadge>
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
      <Tooltip
        disableFocusListener
        enterTouchDelay={0}
        title={tooltipTitle}
        leaveTouchDelay={5000}
      >
        <FRefQuantityIndicator
          amountClaimedByOthers={amountClaimedByOthers}
          amountClaimedByYou={claimedByEmail[share.invitedEmail] || 0}
          total={wishQuantity}
        />
      </Tooltip>
    </Box>
  )
}
