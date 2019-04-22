/* global fetch */
import { Auth } from 'aws-amplify'
import { errorHandler } from './errors'

export const bwFetch = async (path, { headers = {}, ...options } = {}) => {
  options = options || {}
  if (options.body) headers['Content-Type'] = 'application/json'
  if (path.startsWith('private')) {
    headers.Authorization = `Bearer ${
      (await Auth.currentSession()).idToken.jwtToken
    }`
  }
  const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/${path}`, {
    method: 'GET',
    headers,
    ...options
  })
  if (response.ok) return response.json()
  else {
    errorHandler(await response.json())
  }
}
