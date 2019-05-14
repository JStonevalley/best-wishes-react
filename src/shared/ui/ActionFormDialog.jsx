import React, { useState } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import { Fab } from '@material-ui/core'
import { Form } from 'react-final-form'

const actionFormDialogStyles = theme => ({
  fabRoot: {
    position: 'absolute',
    right: `${3 * theme.spacing.unit}px`,
    bottom: `${3 * theme.spacing.unit}px`
  },
  fabIconMargin: {
    marginRight: `${theme.spacing.unit}px`
  },
  dialogTitle: {
    margin: `0 ${3 * theme.spacing.unit}px`
  },
  dialogContent: {
    display: 'flex',
    flexWrap: 'wrap'
  }
})

export const ActionFormDialog = withStyles(actionFormDialogStyles)(
  ({
    actionButtonText,
    actionButtonIcon: ActionButtonIcon,
    classes,
    onSubmit,
    color,
    title,
    submitButtonText = 'Submit',
    children
  }) => {
    const [isOpen, setIsOpen] = useState(false)
    return (
      <React.Fragment>
        <Fab
          classes={{ root: classes.fabRoot }}
          variant={actionButtonText ? 'extended' : 'round'}
          color={color}
          onClick={() => setIsOpen(true)}
        >
          <ActionButtonIcon
            className={actionButtonText && classes.fabIconMargin}
          />
          {actionButtonText}
        </Fab>
        <Form
          onSubmit={async data => {
            await onSubmit(data)
            setIsOpen(false)
          }}
          render={({ handleSubmit, submitting }) => {
            return (
              <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
                <form onSubmit={handleSubmit}>
                  {title && (
                    <DialogTitle className={classes.dialogTitle}>
                      {title}
                    </DialogTitle>
                  )}
                  <DialogContent className={classes.dialogContent}>
                    {children}
                  </DialogContent>
                  <DialogActions>
                    <Button type='submit' color='primary' disabled={submitting}>
                      {submitButtonText}
                    </Button>
                  </DialogActions>
                </form>
              </Dialog>
            )
          }}
        />
      </React.Fragment>
    )
  }
)
