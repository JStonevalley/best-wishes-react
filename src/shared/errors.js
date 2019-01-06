export const errorHandler = (error) => {
  if (BACKEND_ERRORS[error.name]) throw new BACKEND_ERRORS[error.name](error)
  else throw new Error(error.message || error)
}

class BackendError extends Error {
  constructor ({ name, message, explanation }) {
    super(message)
    if (explanation && typeof explanation !== 'object') throw new TypeError('explanation: should be type object')
    this.explanation = explanation
    this.name = name
    Error.captureStackTrace(this, this.constructor)
  }
}

export const BACKEND_ERRORS = {
  WishError: class WishError extends BackendError {},
  WishListError: class WishListError extends BackendError {},
  ValidationError: class ValidationError extends Error {
    constructor ({ name, path, errors }) {
      super(errors[0])
      this.name = name
      this.path = path
      this.errors = errors
      Error.captureStackTrace(this, this.constructor)
    }
  }
}
