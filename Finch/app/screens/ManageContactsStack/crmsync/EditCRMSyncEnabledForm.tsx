import { Stack } from "native-base"
import React from "react"
import * as yup from "yup"

import { spacing } from "../../../theme"

import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import { FormSingleSwitch } from "../../../components/FormSingleSwitch"
import { ICrmSync } from "../../../models/CrmSync"
import { FormHandle } from "../../SettingsStack/profile/ProfileScreen"

export interface IEditCRMSyncEnabledFormInput {
  IsEnabled: ICrmSync["IsEnabled"]
}

interface IProps {
  data: IEditCRMSyncEnabledFormInput
  onSubmit: (data: IEditCRMSyncEnabledFormInput) => void
}

const schema = yup.object({
  IsEnabled: yup.boolean(),
})

export const EditCRMSyncEnabledForm = React.forwardRef<FormHandle, IProps>(
  ({ onSubmit, data }, ref) => {
    const form = useForm<IEditCRMSyncEnabledFormInput>({
      resolver: yupResolver(schema),
      defaultValues: data,
    })

    const handleOnInvalid = () => {}

    const handleOnValid = (data: IEditCRMSyncEnabledFormInput) => {
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
          name="IsEnabled"
          control={form.control}
          colorScheme="primary"
          errors={form.formState.errors}
          labelTx="crmSync.enabled"
        ></FormSingleSwitch>
      </Stack>
    )
  },
)
