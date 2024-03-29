import { IMessageComment } from "./MessageComment"
import { IPaginatedResponse } from "./PaginatedResponse"

export enum MessageStatusEnum {
  QUEUED = "queued",
  READY = "ready",
  DELIVERED = "delivered",
  ERROR = "error",
  INVALID = "invalid",
  FAILED = "failed",
  UNDELIVERED = "undelivered",
  BLOCKEDNUMBER = "blockednumber",
}
export enum MessageDirectionEnum {
  SENT = "SENT",
  RECEIVED = "RECEIVED",
}
export enum MessageTypeEnum {
  CONVERSATION = "conversation",
  AUTOSCHEDULED = "autoscheduled",
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
  IsSilenced?: boolean
  IsIgnored?: boolean
  SenderMemberId?: string
  SenderName?: string
  Comments?: IMessageComment[]
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
  SenderMemberId?: string
  SenderName?: string
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
  messageMeta?: any
  senderMemberId?: string
  senderName?: string
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
  messageMeta,
  senderName,
  senderMemberId,
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
    SenderName: senderName,
    SenderMemberId: senderMemberId,
    Meta: {
      Source: "web",
      Type: "conversation",
      ...messageMeta,
    },
  }
}

export const formatPhoneNumberForMessage = (phone: string) => {
  // Prepare phone number for twilio input
  // Match +1 with 10 digits after (e.g. +14155552671)
  // Could also be a shortcode

  let scrubbedNumber = phone.replace(/-/g, "").replace("(", "").replace(")", "").replace(/\s/g, "")

  if (scrubbedNumber.length === 5) {
    // Its a short code
    return scrubbedNumber
  }

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

export const getMessageAutomationId = (message: IMessage): string | null => {
  const meta = message.Meta
  let automationRuleId = null

  if (meta) {
    automationRuleId = message.Meta["AutomationRuleId"]
  }

  return automationRuleId
}

export interface IMessageVideoDetails {
  videoId: string
  videoThumbnail: string
  videoUrl: string
  videoDisplayTitle: string
}
export const getMessageVideoDetails = (message: IMessage): IMessageVideoDetails | null => {
  const meta = message.Meta
  const messageBody = message.Message
  let metaVideoDict: IMessageVideoDetails | null = null

  if (meta && meta["isVideoLink"]) {
    const videoUrl = meta["videoUrl"]
    const videoId = meta["videoId"]
    const videoThumbnail = meta["videoThumbail"]
    const videoDisplayTitle = meta["videoDisplayTitle"]

    // is the video url in the message?
    if (messageBody && messageBody.includes(videoUrl)) {
      metaVideoDict = {
        videoId: videoId,
        videoThumbnail: videoThumbnail,
        videoUrl: videoUrl,
        videoDisplayTitle: videoDisplayTitle,
      }
    }
  }

  return metaVideoDict
}

export const getMessageBroadcastId = (message: IMessage): string | null => {
  const meta = message.Meta
  let metaBroadcastId = null

  if (meta) {
    metaBroadcastId = message.Meta["broadcastId"]
  }

  return metaBroadcastId
}

export const getMessageSenderId = (message: IMessage): string | undefined => {
  return message.SenderMemberId
}

export const getMessageSenderName = (message: IMessage): string | undefined => {
  return message.SenderName
}

export const getMessageMetaVideoDetails = (
  messageMeta: any,
  messageBody: string = "",
): IMessageVideoDetails | null => {
  let metaVideoDict: IMessageVideoDetails | null = null

  if (messageMeta && messageMeta["isVideoLink"]) {
    const videoUrl = messageMeta["videoUrl"]
    const videoId = messageMeta["videoId"]
    const videoThumbnail = messageMeta["videoThumbail"]
    const videoDisplayTitle = messageMeta["videoDisplayTitle"]

    // is the video url in the message?
    if (messageBody && messageBody.includes(videoUrl)) {
      metaVideoDict = {
        videoId: videoId,
        videoThumbnail: videoThumbnail,
        videoUrl: videoUrl,
        videoDisplayTitle: videoDisplayTitle,
      }
    }
  }

  return metaVideoDict
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

export const getIsRobotMessage = (message: IMessage): boolean => {
  let isRobot = false

  if (getIsAutoReply(message)) {
    isRobot = true
  } else if (!!getMessageAutomationId(message)) {
    isRobot = true
  } else if (!!getMessageBroadcastId(message)) {
    isRobot = true
  } else if (!!getMessageCampaignId(message)) {
    isRobot = true
  } else if (getIsCompliance(message)) {
    isRobot = true
  }

  return isRobot
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
  } else if (message.Status === MessageStatusEnum.FAILED) {
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

export const getContactId = (message: IMessage): string | undefined => {
  return message.ContactId
}

export const getIsAutoScheduled = (message: IMessage): boolean => {
  let isAutoScheduled = false

  const mType = getMessageType(message)

  if (mType === MessageTypeEnum.AUTOSCHEDULED) {
    isAutoScheduled = true
  }

  return isAutoScheduled
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
