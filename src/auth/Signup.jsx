import React from 'react'
import { TextField } from '@material-ui/core'
import { useForm } from 'react-hook-form'

const Signup = () => {
  const { register, handleSubmit, watch, errors } = useForm()
  const onSubmit = (data) => console.log(data)
  console.log(watch('email'), watch('password'))
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* register your input into the hook by invoking the "register" function */}
      <TextField
        label='Email'
        variant='outlined'
        type='email'
        name='email'
        ref={register}
      />

      {/* include validation with required or other standard HTML validation rules */}
      <TextField
        label='Password'
        variant='outlined'
        type='password'
        name='password'
        ref={register({ required: true })}
      />
      {/* errors will return when field validation fails  */}
      {errors.exampleRequired && <span>This field is required</span>}

      <input type='submit' />
    </form>
  )
}

export default Signup
