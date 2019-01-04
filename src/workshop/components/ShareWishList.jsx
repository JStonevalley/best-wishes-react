import * as React from 'react'
import { Form, Field } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { FieldArray } from 'react-final-form-arrays'
import { RegularTextField } from '../../shared/FormFields'
import { connect } from 'react-redux'
import { compose, withState } from 'recompose'
import { withStyles } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import ShareIcon from '@material-ui/icons/Share'
import DeleteIcon from '@material-ui/icons/Delete'
import AddIcon from '@material-ui/icons/Add'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

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

export const ShareWishList = compose(
  connect(),
  withState('isOpen', 'setIsOpen', false),
  withStyles(styles)
)(({ wishList, isOpen, setIsOpen, classes }) => {
  return <React.Fragment>
    <IconButton onClick={() => setIsOpen(true)} color='primary'>
      <ShareIcon />
    </IconButton>
    <Form
      onSubmit={({ sharedTo }) => {
        console.log(sharedTo)
        setIsOpen(false)
      }}
      initialValues={{ sharedTo: wishList.get('sharedTo') || [''] }}
      mutators={{
        ...arrayMutators
      }}
      render={({ handleSubmit }) => {
        return <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
          <DialogTitle>Share</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Share your wish list to friends and family. Every gift giver will be able to mark blabla
            </DialogContentText>
            <form
              onSubmit={handleSubmit}
              className={classes.flexColumn}
            >
              <FieldArray name='sharedTo'>
                {({ fields }) => <React.Fragment>
                  {fields.map((name, index) => (
                    <div key={name} className={classes.fieldRow}>
                      <Field
                        name={name}
                        component={RegularTextField}
                        label='Email'
                        className={classes.field}
                      />
                      <IconButton onClick={() => fields.remove(index)} color='secondary'>
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  ))}
                  <IconButton className={classes.addFieldButton} onClick={() => fields.push('')} color='primary'>
                    <AddIcon />
                  </IconButton>
                </React.Fragment>}
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
      }}
    />
  </React.Fragment>
})
