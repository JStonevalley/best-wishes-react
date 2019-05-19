import React, { useState } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'

const Confirmation = ({
  open,
  setOpen,
  action,
  confirmationTitle = 'Are you sure?',
  confirmationBody,
  confirmationDialogProps,
  noButtonProps,
  yesButtonProps
}) => {
  const [loading, setLoading] = useState(false)
  const onActionCompleted = () => {
    setOpen(false)
    setLoading(false)
  }
  const onActionError = () => {
    setLoading(false)
  }
  return (
    <Dialog open={open} {...confirmationDialogProps}>
      <DialogTitle>{confirmationTitle}</DialogTitle>
      <DialogContent>
        {confirmationBody}
        {/* {loading && <CircularLoading style={{ top: '50%' }} />} */}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onActionCompleted}
          disabled={loading}
          color='secondary'
          {...noButtonProps}
        >
          {(noButtonProps && noButtonProps.children) || 'No'}
        </Button>
        <Button
          onClick={() => {
            setLoading(true)
            action()
              .then(onActionCompleted)
              .catch(onActionError)
          }}
          color='primary'
          disabled={loading}
          {...yesButtonProps}
        >
          {(yesButtonProps && yesButtonProps.children) || 'Yes, I am sure!'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export const ButtonWithConfirmation = ({
  children,
  action,
  confirmationTitle,
  confirmationBody,
  confirmationDialogProps,
  activationElement: ActivationElement = <Button />,
  tooltip
}) => {
  const [open, setOpen] = useState(false)
  const { activationChildren, ...activationProps } = ActivationElement.props
  const MaybeTooltip = tooltip
    ? props => <Tooltip title={tooltip} {...props} />
    : props => <React.Fragment {...props} />
  return (
    <React.Fragment>
      <MaybeTooltip>
        <ActivationElement.type
          {...activationProps}
          onClick={(...args) => {
            activationProps.onClick && activationProps.onClick(...args)
            setOpen(true)
          }}
        >
          {activationChildren}
          {children}
        </ActivationElement.type>
      </MaybeTooltip>
      <Confirmation
        open={open}
        setOpen={setOpen}
        action={action}
        confirmationTitle={confirmationTitle}
        confirmationBody={confirmationBody}
        confirmationDialogProps={confirmationDialogProps}
      />
    </React.Fragment>
  )
}
