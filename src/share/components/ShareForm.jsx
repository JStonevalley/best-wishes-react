import React, { useEffect, useState, useMemo } from 'react'
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
import { styled } from '@mui/system'
import ShareIcon from '@mui/icons-material/Share'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { useCallback } from 'react'
import { useWishListSharing } from '../share'
import { useUser } from '../../store/user'

const StyledForm = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  rowGap: theme.spacing(1)
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
            console.log('TODO: RESEND', email) // TODO resend email
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
        <DialogContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            rowGap: 1
          }}
        >
          <StyledForm onSubmit={submit}>
            <DialogContentText>
              Enter the emails addresses of friends and family who want to make
              your wishes come true.
            </DialogContentText>
            {fields.map((fieldSpec, index) => {
              return (
                <div
                  key={fieldSpec.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start'
                  }}
                >
                  <Controller
                    render={({ field: { value, ...field } }) => (
                      <Checkbox
                        sx={{ marginTop: '0.35rem' }}
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
                          sx={{ flexGrow: 1 }}
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
                    sx={{ marginTop: '0.25rem' }}
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
          </StyledForm>
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
          <DialogContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              rowGap: 1
            }}
          >
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
