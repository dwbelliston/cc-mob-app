import { IPaginatedResponse } from "./PaginatedResponse"

export interface ITagCreate {
  Title: string
  Description: string
  Color: string
}

export interface ITag extends ITagCreate {
  UserId: string
  TagId: string
  CreatedAt: string
  IsMutable?: boolean
  SourceTagId?: boolean // crm source indication
}

export interface IPaginatedTags extends IPaginatedResponse {
  records: ITag[]
}
