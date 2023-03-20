import { Stack } from "native-base"
import React from "react"
import * as yup from "yup"

import { spacing } from "../../../theme"

import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import { FormSingleSwitch } from "../../../components/FormSingleSwitch"

import { BottomSheetFormControl } from "../../../components/FormControl"

import { FormHandle } from "../profile/ProfileScreen"

export interface IAutoReplyWorkingForm {
  IsEnabled: boolean
  Message?: string
}

interface IProps {
  data: IAutoReplyWorkingForm
  onSubmit: (data: IAutoReplyWorkingForm) => void
}

const schema = yup.object({
  IsEnabled: yup.boolean(),
  Message: yup.string().when("IsEnabled", {
    is: true,
    then: (schema) => schema.required(),
    otherwise: (schema) => schema.nullable(),
  }),
})

export const EditAutoReplyForm = React.forwardRef<FormHandle, IProps>(({ onSubmit, data }, ref) => {
  const form = useForm<IAutoReplyWorkingForm>({
    resolver: yupResolver(schema),
    defaultValues: data,
  })

  const handleOnInvalid = () => {}

  const handleOnValid = (data: IAutoReplyWorkingForm) => {
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
        labelTx="autoreplies.activeAutoReply"
      ></FormSingleSwitch>
      <BottomSheetFormControl
        name="Message"
        control={form.control}
        multiline={true}
        numberOfLines={5}
        labelProps={{
          tx: "fieldLabels.message",
        }}
      ></BottomSheetFormControl>
    </Stack>
  )
})
