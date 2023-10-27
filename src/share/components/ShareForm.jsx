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
  Checkbox,
  CircularProgress
} from '@mui/material'
import { styled } from '@mui/system'
import ShareIcon from '@mui/icons-material/Share'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { useCallback } from 'react'
import { GET_CURRENT_USER } from '../../auth/gql'
import { useMutation, useQuery } from '@apollo/client'
import { CREATE_SHARE, REMOVE_SHARE, SEND_SHARE_EMAILS } from '../gql'
import { prop } from 'ramda'
import { GET_OWN_WISH_LIST } from '../../lists/gql'

const StyledForm = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  rowGap: theme.spacing(2)
}))

export const ShareFormDialog = ({ listId, shares }) => {
  const [createShare, { loading: loadingCreateShare }] = useMutation(CREATE_SHARE, {
    refetchQueries: [{ query: GET_OWN_WISH_LIST, variables: { id: listId } }]
  })
  const [removeShare, { loading: loadingRemoveShare }] = useMutation(REMOVE_SHARE, {
    refetchQueries: [{ query: GET_OWN_WISH_LIST, variables: { id: listId } }]
  })
  const [sendShareEmails, { loading: loadingSendShareEmails }] = useMutation(SEND_SHARE_EMAILS)
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
  const addShareRow = useCallback(() => append({ email: '', include: true }), [append])
  const submit = handleSubmit(async ({ shareEmails }) => {
    const sharesToSendEmailsFor = await Promise.all(
      shareEmails.filter(prop('include')).map(async ({ email }) => {
        return (
          shares.find((share) => share.invitedEmail === email) ||
          (
            await createShare({
              variables: { invitedEmail: email, wishListId: listId }
            })
          ).data.share
        )
      })
    )
    console.log(sharesToSendEmailsFor)
    await sendShareEmails({
      variables: { shareIds: sharesToSendEmailsFor.map(prop('id')) }
    })
    setConfirmIsOpen(false)
    setIsOpen(false)
  })
  if (!userData) return null
  return (
    <>
      <IconButton onClick={() => setIsOpen(true)} aria-label='share' size='large'>
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
            <DialogContentText>Enter the emails addresses of friends and family who want to make your wishes come true.</DialogContentText>
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
                      <Checkbox sx={{ marginTop: '0.35rem' }} checked={value != null ? value : fieldSpec.include} {...field} />
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
                          helperText={errors.shareEmails?.[index]?.email?.message}
                          sx={{ flexGrow: 1 }}
                          {...field}
                        />
                      )
                    }}
                    name={`shareEmails.${index}.email`}
                    control={control}
                    defaultValue={fieldSpec.email}
                    disabled={index < shares.length}
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
                      const existingListShare = shares.find((share) => share.invitedEmail === fieldSpec.email)
                      if (existingListShare)
                        await removeShare({
                          variables: { id: existingListShare.id }
                        })
                      remove(index)
                    }}
                    aria-label='share'
                    size='large'
                    disabled={loadingRemoveShare}
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
            disabled={loadingRemoveShare}
          >
            <AddIcon />
          </IconButton>
          {shareEmails.filter(prop('include')).length === 0 && (
            <Typography sx={{ color: 'error.main', alignSelf: 'center' }}>Select at least one email</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button color='inherit' onClick={() => setIsOpen(false)} disabled={loadingRemoveShare}>
            Cancel
          </Button>
          <Button
            onClick={() => setConfirmIsOpen(true)}
            color='success'
            disabled={loadingRemoveShare || shareEmails.filter(prop('include')).length === 0}
          >
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
            {loadingSendShareEmails ? (
              <CircularProgress />
            ) : (
              shareEmails
                .filter(prop('include'))
                .map(({ email }) => (
                  <Typography key={`confirmNewShares-${email}`}>
                    {shares.find((share) => share.invitedEmail === email) ? `${email} (resend)` : email}
                  </Typography>
                ))
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmIsOpen(false)}>No</Button>
            <Button onClick={submit} color='primary' disabled={loadingCreateShare || loadingSendShareEmails}>
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </Dialog>
    </>
  )
}
