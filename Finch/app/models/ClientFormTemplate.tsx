import { IPaginatedResponse } from "./PaginatedResponse"

export interface IClientFormTemplate {
  TemplateTitle: string
  TemplateDescription?: string
  TemplateImageUrl?: string
  ClientFormTemplateId: string
  UseCase: string
  // ClientForm: IClientForm;
}

export interface IPaginatedClientFormTemplates extends IPaginatedResponse {
  records: IClientFormTemplate[]
}
