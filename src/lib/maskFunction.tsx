// ------------------------------------- FUNCOES ------------------------------------- //

export const handleCpfCnpjMsk = (
  event: React.KeyboardEvent<HTMLInputElement>,
) => {
  const input = event.currentTarget
  input.value = CpfCnpjMask(input.value)
}

export const handlePhoneMsk = (
  event: React.KeyboardEvent<HTMLInputElement>,
) => {
  const input = event.currentTarget
  input.value = phoneMask(input.value)
}

export const handleCep = (event: React.KeyboardEvent<HTMLInputElement>) => {
  const input = event.currentTarget
  input.value = cepMask(input.value)
}

// ------------------------------------- METODOS ------------------------------------- //

const CpfCnpjMask = (value: string) => {
  if (!value) return ''
  value = value.replace(/\D/g, '')

  if (value.length <= 11) {
    value = value.replace(/(\d{3})(\d)/, '$1.$2')
    value = value.replace(/(\d{3})(\d)/, '$1.$2')
    value = value.replace(/(\d{3})(\d)/, '$1-$2')
  } else {
    value = value.replace(/(\d{2})(\d)/, '$1.$2')
    value = value.replace(/(\d{3})(\d)/, '$1.$2')
    value = value.replace(/(\d{3})(\d)/, '$1/$2')
    value = value.replace(/(\d{4})(\d)/, '$1-$2')
  }

  return value
}

const phoneMask = (value: string) => {
  if (!value) return ''
  value = value.replace(/\D/g, '')
  value = value.replace(/(\d{2})(\d)/, '($1) $2')
  if (value.length === 13 || value.length === 14) {
    if (value.length === 13) {
      value = value.replace(/(\d{4})(\d)/, '$1-$2')
    } else if (value.length === 14) {
      value = value.replace(/(\d{5})(\d)/, '$1-$2')
    }
  }
  return value
}

const cepMask = (value: string) => {
  if (!value) return ''
  value = value.replace(/\D/g, '')
  value = value.replace(/(\d{5})(\d)/, '$1-$2')
  return value
}
