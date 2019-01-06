/* global fetch */
import { errorHandler } from './errors'

export const bwFetch = async (path, options = {}) => {
  const response = await fetch(
    `http://localhost:3001/${path}`,
    {
      method: 'GET',
      headers: options.body
        ? {
          'Content-Type': 'application/json'
        }
        : {},
      ...options
    }
  )
  if (response.ok) return response.json()
  else {
    errorHandler(await response.json())
  }
}
