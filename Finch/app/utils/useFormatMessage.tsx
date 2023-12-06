// Format Message

export const renderMessageWithContact = (
  message: string,
  firstName: string,
  lastName: string,
  nickname?: string,
): string => {
  let renderedMessageBody = message

  // Parse text to replace first and last name
  renderedMessageBody = renderedMessageBody.replace(/\${FirstName}/g, firstName)

  const nicknameFallback = nickname || firstName

  renderedMessageBody = renderedMessageBody.replace(/\${Nickname}/g, nicknameFallback)

  renderedMessageBody = renderedMessageBody.replace(/\${LastName}/g, lastName)

  return renderedMessageBody
}
