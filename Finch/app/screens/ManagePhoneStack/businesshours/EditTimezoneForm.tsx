import { Stack } from "native-base"
import React from "react"
import * as yup from "yup"

import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import { FormPicker } from "../../../components/FormPicker"
import { IBusinessHoursForm, TIMEZONES } from "../../../models/CallFlow"
import { spacing } from "../../../theme"
import { FormHandle } from "./BusinessHoursScreen"
interface IProps {
  data: IBusinessHoursForm
  onSubmit: (data: IBusinessHoursForm) => void
}

export const schema = yup.object().shape({
  BusinessTimezone: yup.string().nullable(),
})

export const EditTimezoneForm = React.forwardRef<FormHandle, IProps>(({ onSubmit, data }, ref) => {
  const form = useForm<IBusinessHoursForm>({
    resolver: yupResolver(schema),
    defaultValues: data,
  })

  const handleOnInvalid = () => {}

  const handleOnValid = (data: IBusinessHoursForm) => {
    onSubmit(data)
  }

  React.useImperativeHandle(ref, () => ({
    // start() has type inferrence here
    submitForm() {
      form.handleSubmit(handleOnValid, handleOnInvalid)()
    },
  }))

  return (
    <Stack space={spacing.tiny} py={spacing.tiny} px={spacing.tiny}>
      <FormPicker
        name="BusinessTimezone"
        labelTx="businessHours.selectTimezone"
        control={form.control}
        options={TIMEZONES}
      />
    </Stack>
  )
})
