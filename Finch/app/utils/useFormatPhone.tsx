// Format phone

export const runFormatPhone = (phone: string = "") => {
  const cleaned = runFormatPhoneDigits(phone)
  const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    const intlCode = match[1] ? "+1 " : ""
    return [intlCode, "(", match[2], ") ", match[3], "-", match[4]].join("")
  }
  return null
}

export const runFormatPhoneSimple = (phone: string = "") => {
  const cleaned = runFormatPhoneDigits(phone)
  const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    return ["(", match[2], ") ", match[3], "-", match[4]].join("")
  }
  return cleaned
}

export const runFormatPhoneDigits = (phone: string = "") => {
  const cleaned = ("" + phone).replace(/\D/g, "")
  return cleaned
}

export const runFormatPhoneDigitsStripTo10 = (phone: string = "") => {
  const cleaned = runFormatPhoneDigits(phone)

  if (cleaned.length > 10) {
    return cleaned.slice(cleaned.length - 10)
  } else {
    return cleaned
  }
}

export const runFormatPhoneDigitsLegal = (phone: string = "") => {
  const digits10 = runFormatPhoneDigitsStripTo10(phone)

  const formattedNumber = `+1${digits10}`

  return formattedNumber
}
