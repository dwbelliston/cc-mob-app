import { IPaginatedResponse } from "./PaginatedResponse"

export enum IConnectorTypeEnum {
  MOBILE = "MOBILE",
  EMAIL = "EMAIL",
  SMS = "SMS",
  SMARSH = "SMARSH",
  PROOFPOINT = "PROOFPOINT",
  GLOBALRELAY = "GLOBALRELAY",
  INTRADYN = "INTRADYN",
  WEALTHBOX = "WEALTHBOX",
  REDTAIL = "REDTAIL",
  AGENTCORE = "AGENTCORE",
  RADIUSBOB = "RADIUSBOB",
  HUBSPOT = "HUBSPOT",
  AGENCYBLOC = "AGENCYBLOC",
}

export const SUPPORTED_CRM_URLS = {
  [IConnectorTypeEnum.AGENCYBLOC]:
    "https://cc-west-prd-bucket-users.s3.us-west-2.amazonaws.com/public/general/media/agencybloc_logo.png",
  [IConnectorTypeEnum.AGENTCORE]:
    "https://cc-west-prd-bucket-users.s3.us-west-2.amazonaws.com/public/general/media/agentcore_logo.png",
  [IConnectorTypeEnum.REDTAIL]:
    "https://cc-west-prd-bucket-users.s3.us-west-2.amazonaws.com/public/general/media/redtail_logo.png",
  [IConnectorTypeEnum.HUBSPOT]:
    "https://cc-west-prd-bucket-users.s3.us-west-2.amazonaws.com/public/general/media/hubspot_logo.png",
  [IConnectorTypeEnum.WEALTHBOX]:
    "https://cc-west-prd-bucket-users.s3.us-west-2.amazonaws.com/public/general/media/wealthbox_logo.png",
  [IConnectorTypeEnum.RADIUSBOB]:
    "https://cc-west-prd-bucket-users.s3.us-west-2.amazonaws.com/public/general/media/radiusbob_logo.png",
}

export interface IConnectorCreate {
  ConnectorName: string
  ConnectorType: IConnectorTypeEnum
  Meta: any
}

export interface IConnector extends IConnectorCreate {
  UserId: string
  IsEnabled: boolean
  IsManaged: boolean
  ConnectorId: string
  CreatedAt: string
}

export interface IPaginatedConnectors extends IPaginatedResponse {
  records: IConnector[]
}
