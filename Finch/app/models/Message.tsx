import { IPaginatedResponse } from "./PaginatedResponse"

export enum MessageStatusEnum {
  QUEUED = "queued",
  READY = "ready",
  DELIVERED = "delivered",
  ERROR = "error",
  INVALID = "invalid",
  UNDELIVERED = "undelivered",
  BLOCKEDNUMBER = "blockednumber",
}
export enum MessageDirectionEnum {
  SENT = "SENT",
  RECEIVED = "RECEIVED",
}
export enum MessageTypeEnum {
  CONVERSATION = "conversation",
  AUTOREPLY = "autoreply",
  COMPLIANCE = "compliance",
}

export interface IMessageMediaItem {
  MediaUrl: string
  MediaType?: string
}

export interface IMessage {
  UserId: string
  UserNumber: string
  ContactId?: string
  ContactNumber?: string
  ContactName?: string
  Message?: string
  MessageMediaItems?: IMessageMediaItem[]
  MessageId: string
  CreatedTime: string
  Direction: MessageDirectionEnum
  Status: MessageStatusEnum
  TwilioSid: string
  TwilioNumOfSegments: string
  WebhookUrlStatus: string
  Meta: any
}

export interface IPaginatedMessages extends IPaginatedResponse {
  records: IMessage[]
}

export interface IMessageCreate {
  UserId: string
  UserNumber: string
  MessagingServiceId?: string
  ContactId?: string
  ContactName?: string
  ContactNumber: string
  Message: string
  MessageMediaItems?: IMessageMediaItem[]
  Meta: any
}

export interface IMessageForm {
  userId: string
  userNumber: string
  messagingServiceId?: string
  contactId?: string
  contactName?: string
  contactNumber: string
  messageMediaItems?: IMessageMediaItem[]
  message: string
}

export const transformToApi = ({
  userId,
  userNumber,
  messagingServiceId,
  contactId,
  contactNumber,
  contactName,
  message,
  messageMediaItems,
}: IMessageForm): IMessageCreate => {
  return {
    UserId: userId,
    UserNumber: userNumber,
    MessagingServiceId: messagingServiceId,
    ContactId: contactId,
    ContactNumber: contactNumber,
    ContactName: contactName,
    Message: message,
    MessageMediaItems: messageMediaItems,
    Meta: {
      Source: "web",
      Type: "conversation",
    },
  }
}

export const formatPhoneNumberForMessage = (phone: string) => {
  // Prepare phone number for twilio input
  // Match +1 with 10 digits after (e.g. +14155552671)

  let scrubbedNumber = phone.replace(/-/g, "").replace("(", "").replace(")", "").replace(/\s/g, "")

  // Add +1 if it doenst have it
  if (!scrubbedNumber.startsWith("+1")) {
    scrubbedNumber = `+1${scrubbedNumber}`
  }

  // # Check the length now
  if (scrubbedNumber.length !== 12) {
    throw new Error("Invalid Number")
  }

  return scrubbedNumber
}

export const isDispatchMessage = (message: IMessage) => {
  const metaDispatch = message.Meta.get("disaptchId")

  return !!metaDispatch
}

export const getMessageDispatchId = (message: IMessage): string | null => {
  const meta = message.Meta
  let metaDispatch = null

  if (meta) {
    metaDispatch = message.Meta["dispatchId"]
  }

  return metaDispatch
}

export const getMessageBroadcastId = (message: IMessage): string | null => {
  const meta = message.Meta
  let metaBroadcastId = null

  if (meta) {
    metaBroadcastId = message.Meta["broadcastId"]
  }

  return metaBroadcastId
}

export const getMessageCampaignId = (message: IMessage): string | null => {
  const meta = message.Meta
  let metaDispatch = null

  if (meta) {
    metaDispatch = message.Meta["campaignId"]
  }

  return metaDispatch
}

export const getMessageType = (message: IMessage): string | null => {
  const meta = message.Meta
  let metaType = null

  if (meta) {
    metaType = message.Meta["Type"]
  }

  return metaType
}

export const getIsMessageDelivered = (message: IMessage): boolean => {
  let isMessageDelivered = false

  if (message.Status === MessageStatusEnum.DELIVERED) {
    isMessageDelivered = true
  }

  return isMessageDelivered
}

export const getIsMessageSending = (message: IMessage): boolean => {
  let isMessageSending = false

  if (message.Status === MessageStatusEnum.READY) {
    isMessageSending = true
  } else if (message.Status === MessageStatusEnum.QUEUED) {
    isMessageSending = true
  }

  return isMessageSending
}

export const getIsMessageBlocked = (message: IMessage): boolean => {
  let isMessageBlocked = false

  if (message.Status === MessageStatusEnum.BLOCKEDNUMBER) {
    isMessageBlocked = true
  }

  return isMessageBlocked
}

export const getIsMessageError = (message: IMessage): boolean => {
  let isMessageError = false

  if (message.Status === MessageStatusEnum.ERROR) {
    isMessageError = true
  } else if (message.Status === MessageStatusEnum.UNDELIVERED) {
    isMessageError = true
  } else if (message.Status === MessageStatusEnum.INVALID) {
    isMessageError = true
  }

  return isMessageError
}

export const getIsAutoReply = (message: IMessage): boolean => {
  let isAutoReply = false

  const mType = getMessageType(message)

  if (mType === MessageTypeEnum.AUTOREPLY) {
    isAutoReply = true
  }

  return isAutoReply
}

export const getIsCompliance = (message: IMessage): boolean => {
  let isCompliance = false

  const mType = getMessageType(message)

  if (mType === MessageTypeEnum.COMPLIANCE) {
    isCompliance = true
  }

  return isCompliance
}
export const getIsUserMessage = (message: IMessage): boolean => {
  let isUserMessage = false

  if (message.Direction === MessageDirectionEnum.SENT) {
    isUserMessage = true
  }

  return isUserMessage
}
export const getMessageStatusDisplay = (status: IMessage["Status"]): string => {
  let statusDisplay: string = status

  if (status === MessageStatusEnum.BLOCKEDNUMBER) {
    statusDisplay = "Unsubscribed"
  }

  return statusDisplay
}
