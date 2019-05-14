import React from 'react'
import {
  FormControl,
  InputLabel,
  FormHelperText,
  Input
} from '@material-ui/core'

export const RegularTextField = ({
  input,
  meta,
  label,
  style,
  disabled,
  required,
  fullWidth,
  multiline,
  rows,
  className,
  inputClassName,
  ...rest
}) => {
  const errorText = meta && meta.touched && (meta.error || meta.submitError)
  return (
    <FormControl
      style={style}
      className={className}
      error={Boolean(errorText)}
      disabled={disabled}
      required={required}
      fullWidth={fullWidth}
    >
      <InputLabel>{label}</InputLabel>
      <Input
        multiline={multiline}
        rows={rows}
        className={inputClassName}
        {...input}
        inputProps={rest}
      />
      <FormHelperText>{errorText}</FormHelperText>
    </FormControl>
  )
}
