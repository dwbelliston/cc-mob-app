import { Stack } from "native-base"
import React from "react"
import * as yup from "yup"

import { spacing } from "../../../theme"

import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import { BottomSheetFormControl } from "../../../components/FormControl"
import { ISmsTemplate, ISmsTemplateCreate, ISmsTemplateUpdate } from "../../../models/SmsTemplate"
import { FormHandle } from "../../SettingsScreen/profile/ProfileScreen"

interface IProps {
  data: ISmsTemplate
  onSubmit: (data: ISmsTemplateCreate) => void
}

const schema = yup.object({
  Title: yup.string().required(),
  Message: yup.string().required(),
})

export const CreateSmsTemplateForm = React.forwardRef<FormHandle, IProps>(
  ({ onSubmit, data }, ref) => {
    const form = useForm<ISmsTemplateCreate>({
      resolver: yupResolver(schema),
      defaultValues: {
        Title: "",
        Message: "",
      },
    })

    const handleOnInvalid = () => {}

    const handleOnValid = (data: ISmsTemplateUpdate) => {
      onSubmit(data)
    }

    React.useImperativeHandle(ref, () => ({
      // start() has type inferrence here
      submitForm() {
        form.handleSubmit(handleOnValid, handleOnInvalid)()
      },
    }))

    return (
      <Stack space={spacing.tiny}>
        <BottomSheetFormControl
          name="Title"
          control={form.control}
          multiline={false}
          labelProps={{
            tx: "fieldLabels.title",
          }}
        ></BottomSheetFormControl>
        <BottomSheetFormControl
          name="Message"
          control={form.control}
          multiline={true}
          numberOfLines={5}
          labelProps={{
            tx: "fieldLabels.template",
          }}
        ></BottomSheetFormControl>
      </Stack>
    )
  },
)
