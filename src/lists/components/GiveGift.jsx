import { Badge, Box, IconButton } from '@mui/material'
import React from 'react'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import RedeemIcon from '@mui/icons-material/Redeem'

export const GiveGift = ({
  amountClaimedByYou,
  claimWish,
  removeWishClaim
}) => {
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
        onClick={() => alert('TODO: claim wish')}
        aria-label='edit'
        size='large'
      >
        <AddIcon />
      </IconButton>
    </Box>
  )
}
