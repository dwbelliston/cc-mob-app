import { IPaginatedResponse } from "./PaginatedResponse"

export interface IPublicTeamMemberInvite {
  Email: string
  OrganizationName: string
  InviterName: string
  InviterEmail: string
  BrandUrl?: string
}

export interface ITeamMemberUpdate {
  IsActive?: boolean
}

export interface ITeamMemberCreate extends ITeamMemberUpdate {
  Email: string
}

export interface ITeamMemberJoin {
  TeamMemberId: string
  Email: string
  FirstName: string
  LastName: string
  Phone: string
}
export interface ITeamMemberJoinResponse extends ITeamMemberJoin {
  TempPassword: string
}

export interface ITeamMember extends ITeamMemberCreate {
  UserId: string
  FirstName?: string
  LastName?: string
  TeamMemberId: string
  CreatedAt: string
  Name?: string
  IsInvited?: boolean
  IsJoined?: boolean
  IsMember?: boolean
  IsAdmin?: boolean
  CognitoUserId?: string
  BrandImageUrl?: string
}

// In the form, we change it to allow mode
export interface ITeamMemberWorkingForm extends Partial<ITeamMemberUpdate> {}

export interface IPaginatedTeamMembers extends IPaginatedResponse {
  records: ITeamMember[]
}
