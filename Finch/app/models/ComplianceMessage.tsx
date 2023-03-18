import * as Yup from "yup"
import { COMPLIANCE_MESSAGE_TEXT, REGEX_COMPLIANCE_MESSAGE_TEXT } from "../utils/constants"

export interface IComplianceMessageEnabledUpdate {
  IsEnabled: boolean
}

export interface IComplianceMessageMessageUpdate {
  Message: string
}

export interface IComplianceMessage {
  IsEnabled: boolean
  Message: string
  UserId: string
  CreatedAt: string
  UpdatedAt?: string
}

export const ComplianceMessageFormSchema = Yup.object().shape({
  IsEnabled: Yup.boolean(),
  Message: Yup.string()
    .matches(REGEX_COMPLIANCE_MESSAGE_TEXT, `Say something like:  ${COMPLIANCE_MESSAGE_TEXT}`)
    .max(300, "Too long (300 Characters please)")
    .required("Required"),
})
