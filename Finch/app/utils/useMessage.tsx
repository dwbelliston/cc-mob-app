// Format phone

import { IUserProfile } from "../models/UserProfile"
import { runFormatPhoneSimple } from "./useFormatPhone"

export const runIsMessageContainsPlaceholder = (messageBody: string = "") => {
  let isMessageContainPlaceholder = false

  isMessageContainPlaceholder = messageBody.includes("__")

  return isMessageContainPlaceholder
}

export const renderMessageWithUser = (message: string, userProfile: IUserProfile): string => {
  let renderedMessageBody = message

  // Parse text to replace first and last name
  renderedMessageBody = renderedMessageBody.replace(/\#company/g, userProfile.CompanyName)

  renderedMessageBody = renderedMessageBody.replace(/\#firstname/g, userProfile.FirstName)

  renderedMessageBody = renderedMessageBody.replace(/\#lastname/g, userProfile.LastName)

  const mynumber = runFormatPhoneSimple(userProfile.RegisteredNumber?.PhoneNumber)
  if (mynumber) {
    renderedMessageBody = renderedMessageBody.replace(/\#number/g, mynumber)
  }

  return renderedMessageBody
}
