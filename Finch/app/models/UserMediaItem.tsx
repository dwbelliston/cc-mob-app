import { IPaginatedResponse } from "./PaginatedResponse"

export interface IUserMediaItemUpdate {
  Title: string
  Description: string
  IsManaged?: boolean
}

export interface IUserMediaItemBase {
  Title: string
  MediaUrl: string
  MediaType: string
}

export interface IUserMediaItem extends IUserMediaItemBase {
  Description: string
  UserId: string
  UserMediaId: string
  CreatedAt: string
  IsManaged?: boolean
  OrganizationId?: string
  CreatedByUserId?: string
  CreatedByUserBrandImageUrl?: string
  CreatedByUserName?: string
}

export interface IPaginatedUserMedias extends IPaginatedResponse {
  records: IUserMediaItem[]
}

export interface IPaginatedUserMediaItems extends IPaginatedResponse {
  records: IUserMediaItem[]
}
