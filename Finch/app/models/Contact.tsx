import { IPaginatedResponse } from "./PaginatedResponse"

export enum NumberCarrierTypeEnum {
  // Twilio carrier types
  // https://www.twilio.com/docs/lookup/tutorials/carrier-and-caller-name
  MOBILE = "mobile",
  LANDLINE = "landline",
  VOIP = "voip",
  INVALID = "invalid",
  ERROR = "error",
}

export interface IContactBase {
  FirstName: string
  LastName: string
  Phone: string
  Email?: string
  Address1?: string
  Address2?: string
  BirthDate?: string
  City?: string
  State?: string
  Zip?: string
  Tags?: string[]
  SourceId?: string
  SourceMeta?: any
  SourceType?: string
  LastSyncTime?: string
}

export interface IContactUpdate extends IContactBase {}

export interface IContact extends IContactBase {
  ContactId?: string
  UploadId?: string
  CreatedAt?: string
  Version?: string
  Versions?: any
  LastContactedTime?: string
  LastSubmittedTime?: string
  LastDroppedTime?: string
  NumberLookupAt?: string
  NumberCarrierName?: string
  NumberCarrierType?: NumberCarrierTypeEnum
  NumberMeta?: any
  IsArchived?: boolean
}

export interface IContactForm {
  firstName: string
  lastName: string
  phone: string
  email: string
  birthdate: Date | null
  address1: string
  city: string
  state: string
  zip: string
  tags: string[]
}

export interface IContactAddForm extends IContactForm {
  consent: boolean
}

export interface IContactFilter {
  field: string
  operator: string
  value: string
}

export interface IContactsStatSummary {
  CountContacts: number
  CountTags: number
  CountSegments: number
  CountUploads: number
  UpdatedAt: string
}

export interface IContactsStatDay {
  UpdatedAt: string
  CountContacts: number
  CountTags: number
  CountSegments: number
  CountUploads: number
}

export const intialFormContact: IContactForm = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  birthdate: null,
  address1: "",
  city: "",
  state: "",
  zip: "",
  tags: [],
}

export interface IPaginatedContacts extends IPaginatedResponse {
  records: IContact[]
}
