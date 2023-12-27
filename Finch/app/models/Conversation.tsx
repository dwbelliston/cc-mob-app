import { getCallStatusDescription } from "../components/CallStatus"
import { IConversationCallProps } from "../screens/ConversationsScreen/ConversationCall"
import { IConversationMessageProps } from "../screens/ConversationsScreen/ConversationMessage"
import { runFormatPhoneDigitsStripTo10 } from "../utils/useFormatPhone"
import { CallDirectionEnum, ICall } from "./Call"
import { IMessage, MessageDirectionEnum } from "./Message"
import { IPaginatedResponse } from "./PaginatedResponse"

export enum ConversationStatusEnum {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
  UNREAD = "UNREAD",
}

export interface IConversation {
  LatestMessage?: IMessage
  LatestCall?: ICall
  Viewers?: { [teammemberId: string]: string }
  UserId: string
  IsRead: boolean
  ConversationId: string
  ConversationFolderId: string
  CreatedAt: string
  UpdatedTime?: string
  ContactId: string
  ContactName: string
  Status: ConversationStatusEnum
}

export interface IPaginatedConversations extends IPaginatedResponse {
  records: IConversation[]
}

export interface IConversationUpdate {
  IsRead: boolean
  ContactId?: string
  ContactName?: string
}

export interface IConversationStatusUpdate {
  status: ConversationStatusEnum
  conversationId: string
}

export interface IConversationViewers {
  Viewers?: { [teammemberId: string]: string }
}

export interface IPaginatedConversationStream extends IPaginatedResponse {
  records: (IMessage | ICall)[]
}

export interface IConversationItem {
  id?: string
  message?: IConversationMessageProps
  call?: IConversationCallProps
}

export const getConversationCreatedTime = (conversation: IConversation) => {
  let createdTime: string

  // Has message
  if (conversation?.LatestMessage) {
    createdTime = conversation.LatestMessage.CreatedTime
  }
  if (conversation?.LatestCall) {
    createdTime = conversation.LatestCall.CreatedTime
  }

  return createdTime
}

export const getConversationContactNumber = (conversation: IConversation) => {
  let number: string

  // Has message
  if (conversation?.LatestMessage) {
    number = conversation.LatestMessage.ContactNumber
  }
  if (conversation?.LatestCall) {
    number = conversation.LatestCall.ContactNumber
  }

  return number
}

export const getConversationLastMessage = (conversation: IConversation) => {
  let message: string

  // Has message
  if (conversation?.LatestMessage) {
    message = conversation.LatestMessage.Message
    if (!message) {
      message = "MEDIA"
    }
  } else {
    // Has Call
    const callStatus = getCallStatusDescription(conversation?.LatestCall?.Status)
    if (callStatus) {
      message = callStatus
    }
  }

  return message
}

export const getConversationIsIncoming = (conversation: IConversation): boolean => {
  let isIncoming: boolean = false

  if (conversation?.LatestMessage) {
    if (conversation.LatestMessage?.Direction) {
      isIncoming = conversation.LatestMessage.Direction === MessageDirectionEnum.RECEIVED
    }
  }

  if (conversation?.LatestCall) {
    if (conversation.LatestCall?.Direction) {
      isIncoming = conversation.LatestCall.Direction === CallDirectionEnum.INBOUND
    }
  }

  return isIncoming
}

export const getConversationIsLastAMessage = (conversation: IConversation): boolean => {
  return !!conversation?.LatestMessage
}

export const getConversationIsLastACall = (conversation: IConversation): boolean => {
  return !!conversation?.LatestCall
}

export const getConversationId = (userNumber: string, contactNumber: string): string => {
  const uNumber = runFormatPhoneDigitsStripTo10(userNumber)
  const cNumber = runFormatPhoneDigitsStripTo10(contactNumber)

  return `1${uNumber}TO1${cNumber}`
}

export const runGetLatestConversationTimestamp = (conversation: IConversation | null) => {
  let latestCreatedTimestamp = ""

  if (conversation) {
    if (conversation.LatestMessage) {
      latestCreatedTimestamp = conversation.LatestMessage.CreatedTime
    } else if (conversation.LatestCall) {
      latestCreatedTimestamp = conversation.LatestCall.CreatedTime
    }
  }

  return latestCreatedTimestamp
}

export const runGetLatestConversationTimestampNum = (
  conversation: IConversation | null,
): number | null => {
  let resNum: number | null = null
  let latestCreatedTimestamp = runGetLatestConversationTimestamp(conversation)

  if (latestCreatedTimestamp) {
    resNum = parseInt(latestCreatedTimestamp)
  }
  return resNum
}

export const runGetLatestViewedTimestamp = (
  teammemberId: string,
  conversation: IConversation | null,
) => {
  let latestViewedTimestamp = ""

  if (conversation) {
    if (conversation.Viewers && conversation.Viewers[teammemberId]) {
      latestViewedTimestamp = conversation.Viewers[teammemberId]
    }
  }

  return latestViewedTimestamp
}

export const runGetLatestViewedTimestampNum = (
  teammemberId: string,
  conversation: IConversation | null,
): number | null => {
  let resNum: number | null = null
  let latestCreatedTimestamp = runGetLatestViewedTimestamp(teammemberId, conversation)

  if (latestCreatedTimestamp) {
    resNum = parseInt(latestCreatedTimestamp)
  }
  return resNum
}
