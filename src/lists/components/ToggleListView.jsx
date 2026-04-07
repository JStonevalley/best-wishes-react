import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import ImageIcon from '@mui/icons-material/Image'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import { VIEWS } from './ToggleListViewController'

export const ToggleListView = ({ view, setView }) => {
  return (
    <ToggleButtonGroup value={view} exclusive onChange={(_, view) => setView(view)} size='small' aria-label='list view'>
      <ToggleButton value={VIEWS.DENSE}>
        <FormatListBulletedIcon />
      </ToggleButton>
      <ToggleButton value={VIEWS.SPACIOUS}>
        <ImageIcon />
      </ToggleButton>
    </ToggleButtonGroup>
  )
}
