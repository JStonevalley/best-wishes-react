import { Dialog } from '@mui/material'
import { useState } from 'react'

export const Lightbox = ({ src, alt, activationElement = <img alt={alt} /> }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { children, ...activationProps } = activationElement.props
  const ActivationElement = activationElement.type
  return (
    <>
      <ActivationElement
        {...activationProps}
        onClick={(...args) => {
          activationProps.onClick?.(...args)
          setIsOpen(true)
        }}
      >
        {children}
      </ActivationElement>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <img src={src} alt={alt} />
      </Dialog>
    </>
  )
}
