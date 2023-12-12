export interface IMessageComment {
  Comment?: string
  CreatedByUserId?: string
  CreatedByUserName?: string
  MessageCommentId?: string
  CreatedTime?: string
  UpdatedAt?: string
}

export interface IMessageCommentCreate {
  Comment: string
  CreatedByUserId: string
  CreatedByUserName: string
}
