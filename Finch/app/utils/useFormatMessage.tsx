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
