import { Badge, Box, IconButton } from '@mui/material'
import React from 'react'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import RedeemIcon from '@mui/icons-material/Redeem'
import { useMutation } from '@apollo/client'
import { CLAIM_WISH } from '../../share/gql'

export const ClaimWish = ({
  share,
  wishId,
  amountClaimedByYou,
  removeWishClaim
}) => {
  const [claimWish] = useMutation(CLAIM_WISH)
  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
      <IconButton
        onClick={() => alert('TODO: subtract claimed wish')}
        size='large'
      >
        <RemoveIcon />
      </IconButton>
      <Badge badgeContent={amountClaimedByYou} color='success'>
        <RedeemIcon />
      </Badge>
      <IconButton
        onClick={() => claimWish({ variables: { id: share.id, wishId } })}
        size='large'
      >
        <AddIcon />
      </IconButton>
    </Box>
  )
}
