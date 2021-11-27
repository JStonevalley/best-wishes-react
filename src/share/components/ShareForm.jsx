import React, { useEffect, useState, useMemo } from 'react'
import makeStyles from '@mui/styles/makeStyles'
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
} from '@mui/material'
import ShareIcon from '@mui/icons-material/Share'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
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

export const ShareFormDialog = ({ listId, shares }) => {
  const listShares = useMemo(
    () =>
      Object.values(shares).filter(
        (shareDoc) => shareDoc.data().list.id === listId
      ),
    [listId, shares]
  )
  const findListShare = (email) =>
    listShares.find((shareDoc) => shareDoc.data().invitedEmail === email)
  const { addShare, removeShare } = useWishListSharing()
  const user = useUser()
  const [isOpen, setIsOpen] = useState(false)
  const [confirmIsOpen, setConfirmIsOpen] = useState(false)
  const classes = useStyles()
  const {
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors }
  } = useForm({ mode: 'onTouched', defaultValues: { shareEmails: [] } })
  useEffect(() => {
    if (isOpen) {
      reset({
        shareEmails:
          listShares.length > 0
            ? listShares.map((shareDoc) => ({
                email: shareDoc.data().invitedEmail,
                include: false
              }))
            : [{ email: '', include: true }]
      })
    }
  }, [isOpen, reset, listShares])
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'shareEmails'
  })
  const [shareEmails] = watch(['shareEmails'])
  const addShareRow = useCallback(() => append({ email: '', include: true }), [
    append
  ])
  const submit = handleSubmit(async ({ shareEmails }) => {
    await Promise.all(
      shareEmails
        .filter((share) => share.include)
        .map(({ email }) => {
          if (findListShare(email)) {
            console.log('TODO: RESEND', email)
            return Promise.resolve()
          } else {
            return addShare({
              invitedEmail: email,
              listId,
              sharedByUID: user.uid
            })
          }
        })
    )
    setConfirmIsOpen(false)
    setIsOpen(false)
  })
  return (
    <>
      <IconButton
        onClick={() => setIsOpen(true)}
        aria-label='share'
        size='large'
      >
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
                          disabled={index < listShares.length}
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
                    onClick={async () => {
                      const existingListShare = findListShare(fieldSpec.email)
                      if (existingListShare)
                        await removeShare(existingListShare.id)
                      remove(index)
                    }}
                    aria-label='share'
                    size='large'
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
            size='large'
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
                  {findListShare(email) ? `${email} (resend)` : email}
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
