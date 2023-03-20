import * as Yup from "yup"

export interface BusinessHourDaySchedule {
  start: string | null // 0830
  end: string | null // 2200
}
export const TIMEZONES = [
  { label: "Honolulu", value: "Pacific/Honolulu" },
  { label: "Anchorage", value: "America/Anchorage" },
  { label: "Los Angeles", value: "America/Los_Angeles" },
  { label: "Phoenix", value: "America/Phoenix" },
  { label: "Denver", value: "America/Denver" },
  { label: "Detroit", value: "America/Detroit" },
  { label: "Chicago", value: "America/Chicago" },
  { label: "New York", value: "America/New_York" },
]
export const TIMES_OF_DAY = [
  { label: "Closed", value: "" },
  { label: "5:00 AM", value: "0500" },
  { label: "5:30 AM", value: "0530" },
  { label: "6:00 AM", value: "0600" },
  { label: "6:30 AM", value: "0630" },
  { label: "7:00 AM", value: "0700" },
  { label: "7:30 AM", value: "0730" },
  { label: "8:00 AM", value: "0800" },
  { label: "8:30 AM", value: "0830" },
  { label: "9:00 AM", value: "0900" },
  { label: "9:30 AM", value: "0930" },
  { label: "10:00 AM", value: "1000" },
  { label: "10:30 AM", value: "1030" },
  { label: "11:00 AM", value: "1100" },
  { label: "11:30 AM", value: "1130" },
  { label: "12:00 PM", value: "1200" },
  { label: "12:30 PM", value: "1230" },
  { label: "1:00 PM", value: "1300" },
  { label: "1:30 PM", value: "1330" },
  { label: "2:00 PM", value: "1400" },
  { label: "2:30 PM", value: "1430" },
  { label: "3:00 PM", value: "1500" },
  { label: "3:30 PM", value: "1530" },
  { label: "4:00 PM", value: "1600" },
  { label: "4:30 PM", value: "1630" },
  { label: "5:00 PM", value: "1700" },
  { label: "5:30 PM", value: "1730" },
  { label: "6:00 PM", value: "1800" },
  { label: "6:30 PM", value: "1830" },
  { label: "7:00 PM", value: "1900" },
  { label: "7:30 PM", value: "1930" },
  { label: "8:00 PM", value: "2000" },
  { label: "8:30 PM", value: "2030" },
  { label: "9:00 PM", value: "2100" },
  { label: "9:30 PM", value: "2130" },
  { label: "10:00 PM", value: "2200" },
  { label: "10:30 PM", value: "2230" },
  { label: "11:00 PM", value: "2300" },
  { label: "11:30 PM", value: "2330" },
]

export interface ICallForwardingForm {
  IsEnableForwardCall: boolean
  NumberForwardTo?: string
}

export interface IBusinessHoursForm {
  IsEnableBusinessHours?: boolean
  BusinessTimezone?: string
  BusinessSchedule?: BusinessHourDaySchedule[]
}

export interface ICallFlowForm {
  IsEnableForwardCall?: boolean
  IsEnableInAppCalling?: boolean
  NumberForwardTo?: string
  IsEnableAutoRecordCalls?: boolean
  VoicemailAudioUrl?: string
  IsEnableTranscribeVoicemail?: boolean
  IsEnableFilterProfanity?: boolean
  IsEnablePhoneMenu?: boolean
  IsEnableBusinessHours?: boolean
  BusinessTimezone?: string
  BusinessSchedule?: BusinessHourDaySchedule[]
  OutsideHoursVoicemailAudioUrl?: string
  IsEnableAutoIncomingMessage?: boolean
  TextAutoIncomingMessage?: string
  IsEnableAutoMissedCall?: boolean
  TextAutoMissedCall?: string
  IsEnableAutoOutsideHoursIncomingMessage?: boolean
  TextAutoOutsideHoursIncomingMessage?: string
  IsEnableAutoOutsideHoursMissedCall?: boolean
  TextAutoAutoOutsideHoursMissedCall?: string
}

export interface ICallFlow extends ICallFlowForm {
  UserId: string
  CreatedAt: string
  UpdatedAt?: string
}

export const CallFlowFormSchema = Yup.object().shape({
  IsEnableForwardCall: Yup.boolean(),
  IsEnableInAppCalling: Yup.boolean(),
  // NumberForwardTo: Yup.string()
  //   .nullable()
  //   .matches(REGEX_PHONE, "Use 10 digit phone")
  //   .when("IsEnableForwardCall", {
  //     is: (val) => val,
  //     then: Yup.string().matches(REGEX_PHONE, "Use 10 digit phone").required("Required"),
  //   }),
  IsEnableAutoRecordCalls: Yup.boolean(),
  VoicemailAudioUrl: Yup.string().nullable(),
  IsEnableTranscribeVoicemail: Yup.boolean(),
  IsEnableFilterProfanity: Yup.boolean(),
  IsEnablePhoneMenu: Yup.boolean(),
  IsEnableBusinessHours: Yup.boolean(),
  BusinessTimezone: Yup.string().nullable(),
  BusinessSchedule: Yup.array().of(
    Yup.object().shape({
      start: Yup.string(),
      end: Yup.string(),
    }),
  ),
  OutsideHoursVoicemailAudioUrl: Yup.string().nullable(),
  IsEnableAutoIncomingMessage: Yup.boolean(),
  TextAutoIncomingMessage: Yup.string().nullable(),
  IsEnableAutoMissedCall: Yup.boolean(),
  TextAutoMissedCall: Yup.string().nullable(),
  IsEnableAutoOutsideHoursIncomingMessage: Yup.boolean(),
  TextAutoOutsideHoursIncomingMessage: Yup.string().nullable(),
  IsEnableAutoOutsideHoursMissedCall: Yup.boolean(),
  TextAutoAutoOutsideHoursMissedCall: Yup.string().nullable(),
})
