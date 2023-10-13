import React, { useState } from 'react'
import ImageIcon from '@mui/icons-material/Image'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'

export const VIEWS = {
  DENSE: 'dense',
  SPACIOUS: 'spacious'
}

export const ToggleListView = ({ view, setView }) => {
  return <ToggleButtonGroup
    value={view}
    exclusive
    onChange={(_, view) => setView(view)}
    size='small'
    aria-label="list view"
  >
    <ToggleButton value={VIEWS.DENSE}>
      <FormatListBulletedIcon />
    </ToggleButton>
    <ToggleButton value={VIEWS.SPACIOUS}>
      <ImageIcon />
    </ToggleButton>
  </ToggleButtonGroup>
}

export const useListViewController = () => {
  const [ view, setViewState ] = useState(localStorage.getItem('wishListView') || VIEWS.DENSE)
  const setView = (view) => {
    localStorage.setItem('wishListView', view);
    setViewState(view)
  }
  return { view, setView }
}