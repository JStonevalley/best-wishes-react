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
import { useCallback } from 'react'
import { useWishListSharing } from '../share'
import { useUser } from '../../store/user'

const useStyles = makeStyles((theme) => ({
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: theme.spacing(1)
  },
  shareFieldRow: {
    display: 'flex',
    alignItems: 'flex-start'
  },
  shareFieldRowCheckbox: {
    marginTop: '0.35rem'
  },
  shareFieldRowTextInput: {
    flexGrow: 1
  },
  shareFieldRowRemove: {
    marginTop: '0.25rem'
  }
}))

const sharedTo = ['test@shared.se', 'test@shared.com']

export const ShareFormDialog = ({ listId }) => {
  const { addShare, removeShare } = useWishListSharing()
  const user = useUser()
  const [isOpen, setIsOpen] = useState(false)
  const [confirmIsOpen, setConfirmIsOpen] = useState(false)
  const classes = useStyles()
  const {
    handleSubmit,
    control,
    watch,
    formState: { errors }
  } = useForm({
    mode: 'onTouched',
    defaultValues: {
      shareEmails:
        sharedTo.length > 0
          ? sharedTo.map((email) => ({ email, include: false }))
          : [{ email: '', include: true }]
    }
  })
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'shareEmails'
  })
  const [shareEmails] = watch(['shareEmails'])
  const addShareRow = useCallback(() => append({ email: '', include: true }), [
    append
  ])
  const submit = handleSubmit(async ({ shareEmails }) => {
    console.log(shareEmails)
    await Promise.all(
      shareEmails
        .filter((share) => share.include)
        .map(({ email }) =>
          addShare({ invitedEmail: email, listId, sharedByUID: user.uid })
        )
    )
    console.log('Shared')
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
                      <Checkbox
                        className={classes.shareFieldRowCheckbox}
                        checked={value != null ? value : fieldSpec.include}
                        {...field}
                      />
                    )}
                    name={`shareEmails.${index}.include`}
                    control={control}
                    defaultValue={fieldSpec.include}
                  />
                  <Controller
                    render={({ field }) => {
                      return (
                        <TextField
                          variant='outlined'
                          type='email'
                          error={Boolean(errors.shareEmails?.[index]?.email)}
                          helperText={
                            errors.shareEmails?.[index]?.email?.message
                          }
                          disabled={index < sharedTo.length}
                          className={classes.shareFieldRowTextInput}
                          {...field}
                        />
                      )
                    }}
                    name={`shareEmails.${index}.email`}
                    control={control}
                    defaultValue={fieldSpec.email}
                    rules={{
                      required: {
                        value: true,
                        message: 'Email is required'
                      },
                      pattern: {
                        value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g,
                        message: 'Invalid email'
                      }
                    }}
                  />
                  <IconButton
                    className={classes.shareFieldRowRemove}
                    onClick={() => remove(index)}
                    aria-label='share'
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
              )
            })}
          </form>
          <IconButton
            style={{ alignSelf: 'center' }}
            onClick={() => addShareRow()}
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
            {shareEmails
              .filter(({ include }) => include)
              .map(({ email }) => (
                <Typography key={`confirmNewShares-${email}`}>
                  {sharedTo.includes(email) ? `${email} (resend)` : email}
                </Typography>
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
