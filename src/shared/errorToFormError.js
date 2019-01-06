import { FORM_ERROR } from 'final-form'
import { BACKEND_ERRORS } from './errors'

const inflatePath = (path, error, obj = {}) => {
  const startOfNextLevel = path.indexOf('.') + 1
  const hasMoreLevels = Boolean(startOfNextLevel)
  if (hasMoreLevels) {
    const nextKey = path.substring(0, startOfNextLevel - 1)
    obj[nextKey] = {}
    return inflatePath(path.substring(startOfNextLevel), error, obj)
  } else {
    if (path.includes('[')) {
      const [key, index] = path.split(/[[\]]/g)
      obj[key] = []
      obj[key].length = index + 1
      obj[key][index] = error
      return obj
    } else {
      obj[path] = error
      return obj
    }
  }
}

const yupErrorToFinalForError = (validationError) => {
  const error = validationError.errors[0].replace(`${validationError.path} `, '')
  const beautifulError = error.replace(error[0], error[0].toUpperCase())
  return inflatePath(validationError.path, beautifulError)
}

export default (error) => {
  if (!BACKEND_ERRORS[error.name]) throw error
  switch (error.name) {
    case 'ValidationError': return yupErrorToFinalForError(error)
    default: return { [FORM_ERROR]: error.explanation.error }
  }
}
