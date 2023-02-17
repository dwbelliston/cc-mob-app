import { InfiniteData } from "@tanstack/react-query"
import React from "react"
import { useCallStatusDescription } from "../components/CallStatus"
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

export const useGetCountMessages = (
  viewlimit: number,
  data: InfiniteData<IPaginatedConversations>,
): string | null => {
  let badge = null

  if (data && data.pages && data.pages[0].meta.total > 0) {
    // We have some data
    const countTotal = data.pages[0].meta.total

    badge = countTotal > viewlimit ? `${viewlimit}+` : `${countTotal}`
  }

  return badge
}

export const useConversationCreatedTime = (conversation: IConversation) => {
  const [createdTime, setCreatedTime] = React.useState<string>()

  React.useEffect(() => {
    // Has message
    if (conversation?.LatestMessage) {
      setCreatedTime(conversation.LatestMessage.CreatedTime)
    }
    if (conversation?.LatestCall) {
      setCreatedTime(conversation.LatestCall.CreatedTime)
    }
  }, [conversation])

  return createdTime
}

export const useConversationContactNumber = (conversation: IConversation) => {
  const [number, setNumber] = React.useState<string>()

  React.useEffect(() => {
    // Has message
    if (conversation?.LatestMessage) {
      setNumber(conversation.LatestMessage.ContactNumber)
    }
    if (conversation?.LatestCall) {
      setNumber(conversation.LatestCall.ContactNumber)
    }
  }, [conversation])

  return number
}

export const useConversationLastMessage = (conversation: IConversation) => {
  const [message, setMessage] = React.useState<string>()

  const callStatus = useCallStatusDescription(conversation?.LatestCall?.Status)

  React.useEffect(() => {
    // Has message
    if (conversation?.LatestMessage) {
      setMessage(conversation.LatestMessage.Message)
    }
    // Has Call
    if (callStatus) {
      setMessage(callStatus)
    }
  }, [conversation, callStatus])

  return message
}

export const useConversationIsIncoming = (conversation: IConversation): boolean => {
  const [isIncoming, setisIncoming] = React.useState<boolean>(false)

  React.useEffect(() => {
    // Has message
    if (conversation?.LatestMessage) {
      if (conversation.LatestMessage?.Direction) {
        setisIncoming(conversation.LatestMessage.Direction === MessageDirectionEnum.SENT)
      }
    }

    if (conversation?.LatestCall) {
      if (conversation.LatestCall?.Direction) {
        setisIncoming(conversation.LatestCall.Direction === CallDirectionEnum.OUTBOUND)
      }
    }
  }, [conversation])

  return isIncoming
}
export const useConversationIsLastAMessage = (conversation: IConversation): boolean => {
  return !!conversation?.LatestMessage
}

export const useConversationIsLastACall = (conversation: IConversation): boolean => {
  return !!conversation?.LatestCall
}
