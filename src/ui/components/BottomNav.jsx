import React from 'react'
import { BottomNavigation, BottomNavigationAction } from '@material-ui/core'
import InboxIcon from '@material-ui/icons/MoveToInbox'
import ListIcon from '@material-ui/icons/List'
import { useUser } from '../../store/user'
import { useLocation } from 'react-router'
import { Link } from 'react-router-dom'

const NAV_DESTINATIONS = [['/lists', '/list'], ['/shared']]

const BottomNav = () => {
  const location = useLocation()
  const user = useUser()
  if (!user) return null
  return (
    <BottomNavigation
      value={NAV_DESTINATIONS.findIndex((destinations) =>
        destinations.find((destination) =>
          location.pathname.startsWith(destination)
        )
      )}
      showLabels
    >
      <BottomNavigationAction
        component={Link}
        to={NAV_DESTINATIONS[0][0]}
        label='Lists'
        icon={<ListIcon />}
      />
      <BottomNavigationAction
        component={Link}
        to={NAV_DESTINATIONS[1][0]}
        label='Shared with me'
        icon={<InboxIcon />}
      />
    </BottomNavigation>
  )
}

export default BottomNav
