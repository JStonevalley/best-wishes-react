import React, { useEffect, useState } from 'react'
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
import { GET_CURRENT_USER } from '../../auth/gql'
import { useMutation, useQuery } from '@apollo/client'
import { CREATE_SHARE, REMOVE_SHARE } from '../gql'

const StyledForm = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  rowGap: theme.spacing(1)
}))

export const ShareFormDialog = ({ listId, shares }) => {
  const [createShare] = useMutation(CREATE_SHARE, {
    refetchQueries: [`getOwnWishList({"id":"${listId}"})`]
  })
  const [removeShare] = useMutation(REMOVE_SHARE, {
    refetchQueries: [`getOwnWishList({"id":"${listId}"})`]
  })
  const { data: userData } = useQuery(GET_CURRENT_USER)
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
          shares.length > 0
            ? shares.map((share) => ({
                email: share.invitedEmail,
                include: false
              }))
            : [{ email: '', include: true }]
      })
    }
  }, [isOpen, reset, shares])
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
        .filter((shareField) => shareField.include)
        .map(async ({ email }) => {
          // eslint-disable-next-line no-unused-vars
          const share =
            shares.find((share) => share.invitedEmail === email) ||
            (await createShare({
              variables: { invitedEmail: email, wishListId: listId }
            }))
        })
    )
    setConfirmIsOpen(false)
    setIsOpen(false)
  })
  if (!userData) return null
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
                          disabled={index < shares.length}
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
                      const existingListShare = shares.find(
                        (share) => share.email === fieldSpec.email
                      )
                      if (existingListShare)
                        await removeShare({
                          variables: { id: existingListShare.id }
                        })
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
                  {shares.find((share) => share.email === email)
                    ? `${email} (resend)`
                    : email}
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
