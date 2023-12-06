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

export enum ContactSourceTypeEnum {
  WEALTHBOX = "WEALTHBOX",
  AGENTCORE = "AGENTCORE",
  RADIUSBOB = "RADIUSBOB",
  REDTAIL = "REDTAIL",
  HUBSPOT = "HUBSPOT",
}

export const CRM_LOGO_MAP = {
  WEALTHBOX: {
    url: "https://cc-west-prd-bucket-users.s3.us-west-2.amazonaws.com/public/general/media/wealthbox-small.png",
    name: "Wealthbox",
    props: {},
    avatarProps: {},
  },
  AGENTCORE: {
    url: "https://cc-west-prd-bucket-users.s3.us-west-2.amazonaws.com/public/general/media/agentcore_logo_small.png",
    name: "AgentCore",
    props: {
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: "gray.200",
    },
  },
  RADIUSBOB: {
    url: "https://cc-west-prd-bucket-users.s3.us-west-2.amazonaws.com/public/general/media/radiusbob_logo_small.png",
    name: "RadiusBob",
    props: {},
    avatarProps: {},
  },
  REDTAIL: {
    url: "https://cc-west-prd-bucket-users.s3.us-west-2.amazonaws.com/public/general/media/redtail_logo_small.png",
    name: "Redtail",
    props: {},
    avatarProps: {},
  },
  HUBSPOT: {
    url: "https://cc-west-prd-bucket-users.s3.us-west-2.amazonaws.com/public/general/media/hubspot_logo_small.png",
    name: "HubSpot",
    avatarProps: {
      bg: "white",
    },
    props: {
      borderStyle: "solid",
      bg: "white",
      borderWidth: 2,
      borderColor: "orange.100",
    },
  },
  AGENCYBLOC: {
    url: "https://cc-west-prd-bucket-users.s3.us-west-2.amazonaws.com/public/general/media/agencybloc_logo_small.png",
    name: "AgencyBloc",
    avatarProps: {},
    props: {
      borderStyle: "solid",
      bg: "white",
      borderWidth: "1px",
      borderColor: "gray.800",
    },
  },
  MEDICAREPRO: {
    url: "https://cc-west-prd-bucket-users.s3.us-west-2.amazonaws.com/public/general/media/medicarepro_logo_small.png",
    name: "MedicarePro",
    avatarProps: {},
    props: {
      bg: "white",
      borderWidth: "1px",
      borderColor: "#2095FE",
    },
  },
}

export interface IContactBase {
  FirstName: string
  LastName: string
  Nickname?: string
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
  SourceType?: ContactSourceTypeEnum
  LastSyncTime?: string
  AvatarUrl?: string
}

export interface IContactUpdate extends IContactBase {}
export interface IContactCreate extends IContactBase {}

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

export const getContactName = (contact: IContact) => {
  return `${contact.FirstName} ${contact.LastName}`
}

export const getContactAddress = (contact?: IContact): string | null => {
  if (!contact) {
    return null
  }

  const line1 = contact.Address2 ? `${contact.Address1} ${contact.Address2}` : contact.Address1

  let line2 = ""

  if (contact.City) {
    line2 = contact.City
  }

  if (contact.State) {
    line2 = line2 ? `${line2}, ${contact.State}` : contact.State
  }

  if (contact.Zip) {
    line2 = line2 ? `${line2} ${contact.Zip}` : contact.Zip
  }

  if (line1 && !line2) {
    return line1
  } else if (line2 && !line1) {
    return line2
  }

  return `${line1}\n${line2}`
}

export const runFormatSourceDisplay = (contactSource: IContact["SourceType"]): string => {
  let sourceType = ""

  if (contactSource === ContactSourceTypeEnum.HUBSPOT) {
    sourceType = "HubSpot"
  } else if (contactSource === ContactSourceTypeEnum.WEALTHBOX) {
    sourceType = "WealthBox"
  } else if (contactSource === ContactSourceTypeEnum.AGENTCORE) {
    sourceType = "AgentCore"
  } else if (contactSource === ContactSourceTypeEnum.RADIUSBOB) {
    sourceType = "RadiusBob"
  } else if (contactSource === ContactSourceTypeEnum.REDTAIL) {
    sourceType = "Redtail"
  }

  return sourceType
}
