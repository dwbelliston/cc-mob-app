import { IMessageMediaItem } from "./Message"
import { IPaginatedResponse } from "./PaginatedResponse"

export enum ScheduledMessageStatusEnum {
  SCHEDULED = "SCHEDULED",
  SENT = "SENT",
  CANCELLED = "CANCELLED",
  FAILED = "FAILED",
}
export enum ScheduledMessageConditionEnum {
  NOREPLYSINCE = "NOREPLYSINCE",
}

export interface IScheduledMessageUpdate {
  // Content
  Message?: string
  MessageMediaItems?: IMessageMediaItem[]
  Meta?: any
  // Schedule
  SendTime: string
  Condition?: ScheduledMessageConditionEnum
}

export interface IScheduledMessageCreate extends IScheduledMessageUpdate {
  // To
  ContactName?: string
  ContactId?: string
  ContactNumber: string
  // From
  UserNumber: string
}

export interface IScheduledMessage extends IScheduledMessageCreate {
  UserId: string
  ScheduledMessageId: string
  SendAttemptsCount: number
  Status: ScheduledMessageStatusEnum
  // Dates
  CreatedTime: string
  UpdatedTime: string
}

export interface IPaginatedScheduledMessages extends IPaginatedResponse {
  records: IScheduledMessage[]
}
