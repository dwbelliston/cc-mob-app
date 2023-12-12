import { Stack } from "native-base"
import React from "react"
import * as yup from "yup"

import { spacing } from "../../../theme"

import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import { FormSingleSwitch } from "../../../components/FormSingleSwitch"

import { BottomSheetFormControl } from "../../../components/FormControl"

import { Text } from "../../../components"
import { MessageOptionPressable } from "../../../components/MessageOptionPressable"
import { AutorepliesEditFormModeEnum } from "../../../models/CallFlow"
import { FormHandle } from "../../SettingsStack/profile/ProfileScreen"

export interface IAutoReplyWorkingForm {
  IsEnabled: boolean
  Message?: string
}

interface IProps {
  data: IAutoReplyWorkingForm
  editMode: AutorepliesEditFormModeEnum
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

export const EditAutoReplyForm = React.forwardRef<FormHandle, IProps>(
  ({ onSubmit, data, editMode }, ref) => {
    const [messageIdeas, setMessageIdeas] = React.useState<string[]>([])
    const form = useForm<IAutoReplyWorkingForm>({
      resolver: yupResolver(schema),
      defaultValues: data,
    })

    const handleOnInvalid = () => {}

    const handleOnValid = (data: IAutoReplyWorkingForm) => {
      onSubmit(data)
    }

    const handleOnUseMessage = (msgBody) => {
      form.setValue("Message", msgBody)
    }

    React.useImperativeHandle(ref, () => ({
      // start() has type inferrence here
      submitForm() {
        form.handleSubmit(handleOnValid, handleOnInvalid)()
      },
    }))

    React.useEffect(() => {
      let messageIdeaUpdate = []
      // Edit during message
      if (AutorepliesEditFormModeEnum.HOURS_MESSAGE === editMode) {
        messageIdeaUpdate = [
          "We got your message and will be right with you!",
          "Thanks for messaging us, we will be right with you.",
          "We receive your message and will respond soon. Thanks!",
        ]
      }
      // Edit during call
      else if (AutorepliesEditFormModeEnum.HOURS_CALL === editMode) {
        messageIdeaUpdate = [
          "Thanks for calling. Give me a second and I'll be right with you.",
          "Sorry I missed you call! I can return it in a moment, or if its easier you can message me here.",
          "Hey sorry we missed your call. We are away for just a moment, feel free to reply here with more info and we will get back soon!",
        ]
      }
      // Edit away message
      else if (AutorepliesEditFormModeEnum.AWAY_MESSAGE === editMode) {
        messageIdeaUpdate = [
          "Thanks for messaging us! We are away right now. Once we get back we will be right with you.",
          "Hey thanks for messaging us. We are out of the office, but will respond once we return!",
        ]
      }
      // Edit away call
      else if (AutorepliesEditFormModeEnum.AWAY_CALL === editMode) {
        messageIdeaUpdate = [
          "Thanks for calling us! We are away right now. Once we get back we will be right with you.",
          "Hey sorry we missed your call. We are away from the office right now, but will respond once we return!",
        ]
      }

      setMessageIdeas(messageIdeaUpdate)
    }, [editMode])

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

        <Stack space={spacing.tiny}>
          <Text tx={"common.ideas"} textAlign={"center"} colorToken="text.softer"></Text>
          <Stack space={spacing.tiny}>
            {messageIdeas.map((msgBody, idx) => {
              return (
                <MessageOptionPressable
                  key={idx}
                  msgBody={msgBody}
                  onPress={() => {
                    handleOnUseMessage(msgBody)
                  }}
                ></MessageOptionPressable>
              )
            })}
          </Stack>
        </Stack>
      </Stack>
    )
  },
)
