import { Stack } from "native-base"
import React from "react"
import * as yup from "yup"

import { spacing } from "../../../theme"

import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import { Text } from "../../../components"
import { BottomSheetFormControl } from "../../../components/FormControl"
import { ISmsTemplate, ISmsTemplateUpdate } from "../../../models/SmsTemplate"
import MessageMediaItemsPreview from "../../ConversationsScreen/MessageMediaItemsPreview"
import { FormHandle } from "../../SettingsStack/profile/ProfileScreen"

interface IProps {
  data: ISmsTemplate
  onSubmit: (data: ISmsTemplateUpdate) => void
}

const schema = yup.object({
  Title: yup.string().required(),
  Message: yup.string().required(),
})

export const EditSmsTemplateForm = React.forwardRef<FormHandle, IProps>(
  ({ onSubmit, data }, ref) => {
    const form = useForm<ISmsTemplateUpdate>({
      resolver: yupResolver(schema),
      defaultValues: data,
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

        {/* Display media */}
        {data?.MessageMediaItems ? (
          <Stack space={spacing.micro}>
            <Text tx="fieldLabels.attachedImages"></Text>
            <MessageMediaItemsPreview
              isUserMessage={false}
              maxWidth={160}
              mediaItems={data?.MessageMediaItems}
            ></MessageMediaItemsPreview>
          </Stack>
        ) : null}
      </Stack>
    )
  },
)
