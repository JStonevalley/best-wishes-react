export const materialUiFormRegister =
  (register) =>
  (...args) => {
    const { ref, ...inputProps } = register(...args)
    return { ...inputProps, inputProps: { ref } }
  }
