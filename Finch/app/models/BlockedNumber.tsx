import { IPaginatedResponse } from "./PaginatedResponse"

export interface IBlockedNumberStatus {
  Status: string
}

export interface IBlockedNumberCreate {
  Reason: string
  Number: string
}

export interface IBlockedNumber {
  UserId: string
  BlockedNumberId: string
  Reason: string
  Number: string
  CreatedTime: string
}

export interface IPaginatedBlockedNumbers extends IPaginatedResponse {
  records: IBlockedNumber[]
}
