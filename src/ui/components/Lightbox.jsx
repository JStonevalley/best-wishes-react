import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@material-ui/core'

export const Lightbox = ({
  src,
  alt,
  activationElement = <img alt={alt} />
}) => {
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
