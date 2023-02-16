import { ICall } from "./Call"
import { IMessage } from "./Message"
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

export interface IPaginatedConversationStream extends IPaginatedResponse {
  records: (IMessage | ICall)[]
}
