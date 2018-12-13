/* global fetch */

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
  throw new Error(await response.json())
}
