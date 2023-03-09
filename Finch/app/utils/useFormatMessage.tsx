// Format Message

export const renderMessageWithContact = (
  message: string,
  firstName: string,
  lastName: string,
): string => {
  let renderedMessageBody = message

  // Parse text to replace first and last name
  renderedMessageBody = renderedMessageBody.replace(/\${FirstName}/g, firstName)

  renderedMessageBody = renderedMessageBody.replace(/\${LastName}/g, lastName)

  return renderedMessageBody
}
