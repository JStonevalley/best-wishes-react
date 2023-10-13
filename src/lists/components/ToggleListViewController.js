import { useState } from 'react'

export const VIEWS = {
  DENSE: 'dense',
  SPACIOUS: 'spacious'
}

export const useListViewController = () => {
  const [view, setViewState] = useState(localStorage.getItem('wishListView') || VIEWS.DENSE)
  const setView = (view) => {
    localStorage.setItem('wishListView', view)
    setViewState(view)
  }
  return { view, setView }
}
