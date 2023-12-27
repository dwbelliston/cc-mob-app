// Format Message

export const renderMessageWithContact = (
  message: string,
  firstName: string,
  lastName: string,
  nickname?: string,
): string => {
  let renderedMessageBody = message

  // Parse text to replace first and last name
  renderedMessageBody = renderedMessageBody.replace(/\${firstname}/gi, firstName)
  renderedMessageBody = renderedMessageBody.replace(/\${fname}/gi, firstName)
  renderedMessageBody = renderedMessageBody.replace(/\${first}/gi, firstName)

  const nicknameFallback = nickname || firstName

  renderedMessageBody = renderedMessageBody.replace(/\${nickname}/gi, nicknameFallback)
  renderedMessageBody = renderedMessageBody.replace(/\${nick}/gi, nicknameFallback)

  renderedMessageBody = renderedMessageBody.replace(/\${lastname}/gi, lastName)
  renderedMessageBody = renderedMessageBody.replace(/\${lname}/gi, lastName)
  renderedMessageBody = renderedMessageBody.replace(/\${last}/gi, lastName)

  return renderedMessageBody
}

export const renderMessageClean = (message: string): string => {
  // Replace any placeholders with empty string
  let renderedMessageBody = message

  // Hey R${FirstName} R${Lastname}! R${FirstName}! R${erifuheiurf}!! R${FirstName} R${FirstName} R${heythere}Thank you for visiting. Please reach out if you have any questions. R${FirstName} R${FirstName}

  if (renderedMessageBody) {
    // Parse text to replace first and last name
    // renderedMessageBody = renderedMessageBody.replace(/\${FirstName}/g, "");
    // renderedMessageBody = renderedMessageBody.replace(/\${LastName}/g, "");
    renderedMessageBody = renderedMessageBody.replace(/\${[A-Za-z]*}/g, "")
  }

  return renderedMessageBody
}
