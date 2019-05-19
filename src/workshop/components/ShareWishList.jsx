import React, { useState } from 'react'
import { Form, Field } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { FieldArray } from 'react-final-form-arrays'
import { RegularTextField } from '../../shared/FormFields'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { withStyles } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import ShareIcon from '@material-ui/icons/Share'
import DeleteIcon from '@material-ui/icons/Delete'
import EmailIcon from '@material-ui/icons/Email'
import AddIcon from '@material-ui/icons/Add'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Tooltip from '@material-ui/core/Tooltip'
import { shareWishList } from '../actions'
import errorToFormError from '../../shared/errorToFormError'
import { bwFetch } from '../../shared/actions'

const resendEmail = ({ wishListId, email }) =>
  bwFetch(`private/wish-list/share/resend/${wishListId}`, {
    method: 'POST',
    body: JSON.stringify({ email })
  })

const styles = {
  flexColumn: {
    display: 'flex',
    flexDirection: 'column'
  },
  fieldRow: {
    display: 'flex',
    alignItems: 'center'
  },
  field: {
    flexGrow: 1
  },
  addFieldButton: {
    alignSelf: 'center'
  }
}

const defaultButtonElement = (
  <IconButton color='primary'>
    <ShareIcon />
  </IconButton>
)

export const ShareWishList = compose(
  connect((state, { wishList }) => {
    return {
      sharedTo: state.workshop.shares
        .filter(share => share.get('wishList') === wishList.get('id'))
        .map(share => share.get('sharedTo'))
        .toArray()
    }
  }),
  withStyles(styles)
)(
  ({
    wishList,
    sharedTo,
    dispatch,
    classes,
    buttonElement: ButtonElement = defaultButtonElement
  }) => {
    const [isOpen, setIsOpen] = useState(false)
    const { children, ...buttonProps } = ButtonElement.props
    return (
      <React.Fragment>
        <ButtonElement.type
          {...buttonProps}
          onClick={(...args) => {
            buttonProps.onClick && buttonProps.onClick(...args)
            setIsOpen(true)
          }}
        >
          {children}
        </ButtonElement.type>
        <Form
          onSubmit={async ({ sharedTo }) => {
            try {
              await dispatch(
                shareWishList({
                  wishListId: wishList.get('id'),
                  sharedTo: sharedTo.filter(Boolean)
                })
              )
              setIsOpen(false)
            } catch (error) {
              return errorToFormError(error)
            }
          }}
          initialValues={{ sharedTo: [...sharedTo, ''] }}
          mutators={{
            ...arrayMutators
          }}
          render={({ handleSubmit }) => {
            return (
              <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
                <DialogTitle>Share</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Share your wish list to friends and family. Gift givers will
                    be able to indicate to each other what they have bought. You
                    will not be able to see any of that and will hopefully
                    receive beautiful gifts and no duplicates :)
                  </DialogContentText>
                  <form onSubmit={handleSubmit} className={classes.flexColumn}>
                    <FieldArray name='sharedTo'>
                      {({ fields }) => {
                        return (
                          <React.Fragment>
                            {fields.map((name, index) => {
                              const dirtyValue =
                                fields.value[index] !== '' &&
                                fields.value[index] === fields.initial[index]
                              return (
                                <div key={name} className={classes.fieldRow}>
                                  <Field
                                    name={name}
                                    component={RegularTextField}
                                    label='Email'
                                    className={classes.field}
                                  />
                                  <IconButton
                                    onClick={() => fields.remove(index)}
                                    color='secondary'
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                  {dirtyValue && (
                                    <Tooltip title='Resend invitation email'>
                                      <IconButton
                                        onClick={() =>
                                          resendEmail({
                                            wishListId: wishList.get('id'),
                                            email: fields.value[index]
                                          })
                                        }
                                        color='primary'
                                      >
                                        <EmailIcon />
                                      </IconButton>
                                    </Tooltip>
                                  )}
                                </div>
                              )
                            })}
                            <IconButton
                              className={classes.addFieldButton}
                              onClick={() => fields.push('')}
                              color='primary'
                            >
                              <AddIcon />
                            </IconButton>
                          </React.Fragment>
                        )
                      }}
                    </FieldArray>
                  </form>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setIsOpen(false)} color='secondary'>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit} color='primary'>
                    Send
                  </Button>
                </DialogActions>
              </Dialog>
            )
          }}
        />
      </React.Fragment>
    )
  }
)
