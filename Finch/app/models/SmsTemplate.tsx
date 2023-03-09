import { IPaginatedResponse } from "./PaginatedResponse"

export interface ISmsTemplateUpdate {
  Title: string
  Message: string
  IsManaged?: boolean
}

export interface ISmsTemplateCreate extends ISmsTemplateUpdate {}

export interface ISmsTemplate extends ISmsTemplateUpdate {
  UserId: string
  SmsTemplateId: string
  CreatedAt: string
  OrganizationId?: string
  CreatedByUserId?: string
  CreatedByUserBrandImageUrl?: string
  CreatedByUserName?: string
  IsManaged?: boolean
}

// In the form, we change it to allow mode
export interface ISmsTemplateWorkingForm extends Partial<ISmsTemplateUpdate> {}

export const initialSmsTemplateForm: ISmsTemplateWorkingForm = {
  Title: "",
  Message: "",
  IsManaged: false,
}

export interface IPaginatedSmsTemplates extends IPaginatedResponse {
  records: ISmsTemplate[]
}
