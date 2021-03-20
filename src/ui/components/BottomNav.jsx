import React, { useState } from 'react'
import { BottomNavigation, BottomNavigationAction } from '@material-ui/core'
import InboxIcon from '@material-ui/icons/MoveToInbox'
import ListIcon from '@material-ui/icons/List'
import { useUser } from '../../store/user'

const BottomNav = () => {
  const [value, setValue] = useState()
  const user = useUser()
  if (!user) return null
  return (
    <BottomNavigation
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue)
      }}
      showLabels
    >
      <BottomNavigationAction label='Lists' icon={<ListIcon />} />
      <BottomNavigationAction label='Shared with me' icon={<InboxIcon />} />
    </BottomNavigation>
  )
}

export default BottomNav
