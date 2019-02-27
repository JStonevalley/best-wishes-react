export const required = value => {
  return !value ? 'Required' : undefined
}

export const email = value => {
  if (required(value)) return required(value)
  const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  if (!regex.test(String(value).toLowerCase())) return 'Invalid email'
}
