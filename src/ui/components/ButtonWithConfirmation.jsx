import { useState } from "react"
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material"


const defaultConfirmationButton = () =>(<Button color='primary'>Confirm</Button>)
const defaultCancelButton = () =>(<Button color='inherit'>Cancel</Button>)

export const ButtonWithConfirmation = ({
  actionToConfirm,
  confirmationDialogTitle,
  confirmationDialogContent,
  button: { type: ButtonComponent, props: buttonProps },
  confirmationButton: { type: ConfirmationButtonComponent, props: confirmationButtonProps } = defaultConfirmationButton(),
  cancelButton: { type: CancelButtonComponent, props: cancelButtonProps }= defaultCancelButton()
}) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <ButtonComponent { ...buttonProps } onClick={() => setIsOpen(true)} />
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <DialogTitle>{confirmationDialogTitle}</DialogTitle>
        {confirmationDialogContent && <DialogContent>
          {confirmationDialogContent}
        </DialogContent>}
        <DialogActions>
          <CancelButtonComponent autoFocus { ...cancelButtonProps } onClick={() => setIsOpen(false)} />
          <ConfirmationButtonComponent { ...confirmationButtonProps } onClick={actionToConfirm} />
        </DialogActions>
      </Dialog>
    </>
  )
}