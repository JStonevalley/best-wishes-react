import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Typography,
  Checkbox
} from '@material-ui/core'
import ShareIcon from '@material-ui/icons/Share'
import AddIcon from '@material-ui/icons/Add'
import DeleteIcon from '@material-ui/icons/Delete'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { materialUiFormRegister } from '../../tools/forms'
import { useCallback } from 'react'

const useStyles = makeStyles((theme) => ({
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: theme.spacing(1)
  },
  shareFieldRow: {
    display: 'flex'
  },
  shareFieldRowTextInput: {
    flexGrow: 1
  }
}))

const sharedTo = ['test@shared.se', 'test@shared.com']

export const ShareFormDialog = ({ listId }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [confirmIsOpen, setConfirmIsOpen] = useState(false)
  const classes = useStyles()
  const {
    handleSubmit,
    control,
    register,
    watch,
    formState: { errors }
  } = useForm({
    mode: 'onTouched',
    defaultValues: {
      newShareEmails:
        sharedTo.length > 0
          ? sharedTo.map((email) => ({ email, include: false }))
          : [{ email: '', include: true }]
    }
  })
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'newShareEmails'
  })
  const [newShareEmails] = watch(['newShareEmails'])
  const addShare = useCallback(() => append({ email: '', include: true }), [
    append
  ])
  const submit = handleSubmit(async (data) => {
    console.log(data)
  })
  return (
    <>
      <IconButton onClick={() => setIsOpen(true)} aria-label='share'>
        <ShareIcon />
      </IconButton>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <DialogTitle>{`Send your wishes`}</DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <form onSubmit={submit} className={classes.dialogContent}>
            <DialogContentText className={classes.introText}>
              Enter the emails addresses of friends and family who want to make
              your wishes come true.
            </DialogContentText>
            {fields.map((fieldSpec, index) => {
              return (
                <div key={fieldSpec.id} className={classes.shareFieldRow}>
                  <Controller
                    render={({ field: { value, ...field } }) => (
                      <Checkbox checked={value} {...field} />
                    )}
                    name={`newShareEmails.${index}.include`}
                    control={control}
                    defaultValue={fieldSpec.include}
                  />
                  <TextField
                    variant='outlined'
                    type='email'
                    error={Boolean(errors.newShareEmails?.[index]?.email)}
                    helperText={errors.newShareEmails?.[index]?.email?.message}
                    disabled={index < sharedTo.length}
                    {...materialUiFormRegister(register)(
                      `newShareEmails.${index}.email`,
                      {
                        required: {
                          value: true,
                          message: 'Email is required'
                        },
                        pattern: {
                          value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g,
                          message: 'Invalid email'
                        }
                      }
                    )}
                    className={classes.shareFieldRowTextInput}
                  />
                  <IconButton onClick={() => remove(index)} aria-label='share'>
                    <DeleteIcon />
                  </IconButton>
                </div>
              )
            })}
          </form>
          <IconButton
            style={{ justifySelf: 'center' }}
            onClick={() => addShare()}
            aria-label='add share'
          >
            <AddIcon />
          </IconButton>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={() => setConfirmIsOpen(true)} color='primary'>
            Send email invites
          </Button>
        </DialogActions>
        <Dialog open={confirmIsOpen} onClose={() => setConfirmIsOpen(false)}>
          <DialogTitle>{`Do you want to send invites to:`}</DialogTitle>
          <DialogContent className={classes.dialogContent}>
            {newShareEmails?.map(({ email }) => (
              <Typography key={`confirmNewShares-${email}`}>{email}</Typography>
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmIsOpen(false)}>No</Button>
            <Button onClick={submit} color='primary'>
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </Dialog>
    </>
  )
}
