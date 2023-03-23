import { IConnectorTypeEnum } from "./Connector"
import { IPaginatedResponse } from "./PaginatedResponse"

export enum IRoutingEventNameEnum {
  NEW_LEAD = "NEW_LEAD",
  MESSAGE_ALL = "MESSAGE_ALL",
  NEW_SUBMISSION = "NEW_SUBMISSION",
  MESSAGE_INCOMING = "MESSAGE_INCOMING",
  CALL_MISSED = "CALL_MISSED",
  CALL_ALL = "CALL_ALL",
  CONTACT_VERSIONED = "CONTACT_VERSIONED",
  CONTACT_UPDATED = "CONTACT_UPDATED",
  CONTACT_CREATED = "CONTACT_CREATED",
  NEW_AUDIT = "NEW_AUDIT",
}

export enum IRoutingFrequencyEnum {
  STREAM = "STREAM",
  HOURLY = "HOURLY",
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
}

export interface IRoutingRuleCreate {
  EventName: IRoutingEventNameEnum
  Frequency: IRoutingFrequencyEnum
  IsEnabled: boolean
  IsManaged?: boolean
  IsMobileManaged?: boolean
  ConnectorId: string
  ConnectorName: string
  ConnectorType: IConnectorTypeEnum
  ConnectorMeta: any
}

export interface IRoutingRule extends IRoutingRuleCreate {
  RoutingRuleId: string
}

export interface IPaginatedRoutingRules extends IPaginatedResponse {
  records: IRoutingRule[]
}
