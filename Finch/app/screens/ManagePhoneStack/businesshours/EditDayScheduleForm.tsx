import { Stack } from "native-base"
import React from "react"
import * as yup from "yup"

import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import { Text, TextProps } from "../../../components"
import { FormPicker } from "../../../components/FormPicker"
import { BusinessHourDaySchedule, TIMES_OF_DAY } from "../../../models/CallFlow"
import { spacing } from "../../../theme"
import { FormHandle } from "./BusinessHoursScreen"

interface IProps {
  editDayIndex: number
  daySchedule: BusinessHourDaySchedule
  onSubmit: (data: BusinessHourDaySchedule) => void
}

export const SCHEDULE_DAYS: TextProps["tx"][] = [
  "fieldLabels.monday",
  "fieldLabels.tuesday",
  "fieldLabels.wednesday",
  "fieldLabels.thursday",
  "fieldLabels.friday",
  "fieldLabels.saturday",
  "fieldLabels.sunday",
]

export const schema = yup.object().shape({
  daySchedule: yup.object().shape({
    start: yup.string(),
    end: yup.string(),
  }),
})

export const EditDayScheduleForm = React.forwardRef<FormHandle, IProps>(
  ({ editDayIndex, onSubmit, daySchedule }, ref) => {
    const form = useForm<BusinessHourDaySchedule>({
      resolver: yupResolver(schema),
      defaultValues: daySchedule,
    })

    const handleOnInvalid = () => {}

    const handleOnValid = (data: BusinessHourDaySchedule) => {
      onSubmit(data)
    }

    React.useEffect(() => {
      if (daySchedule) {
        form.reset(daySchedule)
      }
    }, [daySchedule])

    React.useImperativeHandle(ref, () => ({
      // start() has type inferrence here
      submitForm() {
        form.handleSubmit(handleOnValid, handleOnInvalid)()
      },
    }))

    return (
      <Stack space={spacing.tiny} py={spacing.tiny} px={spacing.tiny}>
        <Text preset="heading" tx={SCHEDULE_DAYS[editDayIndex]}></Text>
        <FormPicker
          name="start"
          labelTx="common.open"
          control={form.control}
          options={TIMES_OF_DAY}
        />
        <FormPicker
          name="end"
          labelTx="common.close"
          control={form.control}
          options={TIMES_OF_DAY}
        />
      </Stack>
    )
  },
)
