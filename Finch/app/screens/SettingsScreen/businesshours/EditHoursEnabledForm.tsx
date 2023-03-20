import { Stack } from "native-base"
import React from "react"
import * as yup from "yup"

import { spacing } from "../../../theme"

import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import { FormSingleSwitch } from "../../../components/FormSingleSwitch"

import { IBusinessHoursForm } from "../../../models/CallFlow"
import { FormHandle } from "../profile/ProfileScreen"

interface IProps {
  data: IBusinessHoursForm
  onSubmit: (data: IBusinessHoursForm) => void
}

const schema = yup.object({
  IsEnableBusinessHours: yup.boolean(),
})

export const EditHoursEnabledForm = React.forwardRef<FormHandle, IProps>(
  ({ onSubmit, data }, ref) => {
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
        <FormSingleSwitch
          name="IsEnableBusinessHours"
          control={form.control}
          colorScheme="primary"
          errors={form.formState.errors}
          labelTx="businessHours.turnOnHours"
        ></FormSingleSwitch>
      </Stack>
    )
  },
)
