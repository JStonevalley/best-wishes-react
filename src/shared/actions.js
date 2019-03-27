/* global fetch */
import { Auth } from 'aws-amplify'
import { errorHandler } from './errors'

export const bwFetch = async (path, { headers = {}, ...options } = {}) => {
  options = options || {}
  const currentSession = await Auth.currentSession()
  if (options.body) headers['Content-Type'] = 'application/json'
  if (currentSession) {
    headers.Authorization = `Bearer ${currentSession.idToken.jwtToken}`
  }
  const response = await fetch(`http://localhost:3001/${path}`, {
    method: 'GET',
    headers,
    ...options
  })
  if (response.ok) return response.json()
  else {
    errorHandler(await response.json())
  }
}
