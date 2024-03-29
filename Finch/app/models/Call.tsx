import { IPaginatedResponse } from "./PaginatedResponse"

export enum CallDirectionEnum {
  OUTBOUND = "OUTBOUND",
  INBOUND = "INBOUND",
}

export enum RecordingStatusEnum {
  INPROGRESS = "in-progress",
  COMPLETED = "completed",
  ABSENT = "absent",
  NONE = "none",
}

export enum CallStatusEnum {
  CREATED = "created",
  INITIATED = "initiated",
  RINGING = "ringing",
  INPROGRESS = "in-progress",
  COMPLETED = "completed",
  FAILED = "failed",
  BUSY = "busy",
  NOANSWER = "no-answer",
  CANCELED = "canceled",
}

export interface ICall {
  CallId: string
  UserId: string
  UserNumber: string
  ContactId?: string
  ContactNumber?: string
  ContactName?: string
  Direction: CallDirectionEnum
  Status: CallStatusEnum
  CallDurationTime: string
  IsRecorded?: boolean
  RecordingStatus?: RecordingStatusEnum
  RecordingUrl?: string
  TranscriptionText?: string
  RecordingDurationTime?: string
  Meta: any
  CreatedTime: string
  UpdatedTime?: string
  IsForwarded?: boolean
  IsOutsideHours?: boolean
  NumberForwardedTo?: string
  Note?: string
  CallerMemberId?: string
  CallerName?: string
}

export interface IPaginatedCalls extends IPaginatedResponse {
  records: ICall[]
}

export const getIsUserCall = (call: ICall): boolean => {
  let isUserCall = false

  if (call.Direction === CallDirectionEnum.OUTBOUND) {
    isUserCall = true
  }

  return isUserCall
}

export const getCallContactId = (call: ICall): string | undefined => {
  return call.ContactId
}

export const getCallCallerMemberId = (call: ICall): string | undefined => {
  return call.CallerMemberId
}

export const getCallCallerName = (call: ICall): string | undefined => {
  return call.CallerName
}
