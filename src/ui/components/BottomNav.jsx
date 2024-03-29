import React from 'react'
import { BottomNavigation, BottomNavigationAction } from '@mui/material'
import InboxIcon from '@mui/icons-material/MoveToInbox'
import ListIcon from '@mui/icons-material/List'
import { useLocation } from 'react-router'
import { Link } from 'react-router-dom'
import { useUser } from '../../apollo/UserContext'

const NAV_DESTINATIONS = [['/list'], ['/shared']]

const BottomNav = () => {
  const location = useLocation()
  const { googleUser } = useUser()
  if (!googleUser) return null
  return (
    <BottomNavigation
      value={NAV_DESTINATIONS.findIndex((destinations) => destinations.find((destination) => location.pathname.startsWith(destination)))}
      showLabels
    >
      <BottomNavigationAction component={Link} to={NAV_DESTINATIONS[0][0]} label='Lists' icon={<ListIcon />} />
      <BottomNavigationAction component={Link} to={NAV_DESTINATIONS[1][0]} label='Shared with me' icon={<InboxIcon />} />
    </BottomNavigation>
  )
}

export default BottomNav
