import React, { useState } from 'react'
import { TextField, Dialog, DialogContent, DialogContentText, DialogTitle, IconButton, Typography } from '@mui/material'
import { styled } from '@mui/system'
import ShareIcon from '@mui/icons-material/Share'
import SendIcon from '@mui/icons-material/Send'
import DeleteIcon from '@mui/icons-material/Delete'
import { useForm } from 'react-hook-form'
import { GET_CURRENT_USER } from '../../auth/gql'
import { useMutation, useQuery } from '@apollo/client'
import { CREATE_SHARE, REMOVE_SHARE, SEND_SHARE_EMAILS } from '../gql'
import { GET_OWN_WISH_LIST } from '../../lists/gql'
import { materialUiFormRegister } from '../../tools/forms'

const ShareContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  rowGap: theme.spacing(2)
}))

export const ShareFormDialog = ({ listId, shares }) => {
  const [createShare] = useMutation(CREATE_SHARE, {
    refetchQueries: [{ query: GET_OWN_WISH_LIST, variables: { id: listId } }]
  })
  const [removeShare, { loading: loadingRemoveShare }] = useMutation(REMOVE_SHARE, {
    refetchQueries: [{ query: GET_OWN_WISH_LIST, variables: { id: listId } }]
  })
  const [sendShareEmails, { loading: loadingSendShareEmails }] = useMutation(SEND_SHARE_EMAILS)
  const { data: userData } = useQuery(GET_CURRENT_USER)
  const [isOpen, setIsOpen] = useState(false)
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting }
  } = useForm()
  const submit = handleSubmit(async ({ email }) => {
    const share = (
      await createShare({
        variables: { invitedEmail: email, wishListId: listId }
      })
    ).data.share
    await sendShareEmails({
      variables: { shareIds: [share.id] }
    })
    reset()
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
          <ShareContainer>
            <DialogContentText>Enter the email addresses of friends and family who want to make your wishes come true.</DialogContentText>
            {shares.map((share) => {
              return (
                <div
                  key={share.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <Typography noWrap sx={{ marginTop: '0.35rem', flexGrow: 1 }}>
                    {share.invitedEmail}
                  </Typography>
                  <IconButton
                    size='large'
                    onClick={async () => {
                      await sendShareEmails({
                        variables: { shareIds: [share.id] }
                      })
                    }}
                    variant='outlined'
                    disabled={loadingSendShareEmails}
                  >
                    <SendIcon />
                  </IconButton>
                  <IconButton
                    onClick={async () => {
                      await removeShare({
                        variables: { id: share.id }
                      })
                    }}
                    size='large'
                    disabled={loadingRemoveShare}
                    color='error'
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
              )
            })}
            <form
              onSubmit={submit}
              style={{
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <TextField
                label='Email'
                variant='outlined'
                type='email'
                {...materialUiFormRegister(register)('email', {
                  required: {
                    value: true,
                    message: 'Email is required'
                  },
                  pattern: {
                    value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g,
                    message: 'Invalid email'
                  }
                })}
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
                sx={{ flexGrow: 1 }}
              />
              <IconButton size='large' disabled={isSubmitting} type='submit'>
                <SendIcon />
              </IconButton>
              {/* This delete button is only present for alignment */}
              <IconButton style={{ visibility: 'hidden' }} size='large'>
                <DeleteIcon />
              </IconButton>
            </form>
          </ShareContainer>
        </DialogContent>
      </Dialog>
    </>
  )
}
