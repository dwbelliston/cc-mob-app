import { getCallStatusDescription } from "../components/CallStatus"
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
  UserId: string
  IsRead: boolean
  ConversationId: string
  ConversationFolderId: string
  CreatedAt: string
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

export interface IPaginatedConversationStream extends IPaginatedResponse {
  records: (IMessage | ICall)[]
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

  console.log("useConversationContactNumber", conversation.ConversationId)

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
      isIncoming = conversation.LatestMessage.Direction === MessageDirectionEnum.SENT
    }
  }

  if (conversation?.LatestCall) {
    if (conversation.LatestCall?.Direction) {
      isIncoming = conversation.LatestCall.Direction === CallDirectionEnum.OUTBOUND
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
