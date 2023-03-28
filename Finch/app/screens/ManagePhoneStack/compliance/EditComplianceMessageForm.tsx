import { Stack } from "native-base"
import React from "react"
import * as yup from "yup"

import { spacing } from "../../../theme"

import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import { Text } from "../../../components"
import { BottomSheetFormControl } from "../../../components/FormControl"
import { MessageOptionPressable } from "../../../components/MessageOptionPressable"
import { IComplianceMessageMessageUpdate } from "../../../models/ComplianceMessage"
import { IUserProfile } from "../../../models/UserProfile"
import { COMPLIANCE_MESSAGE_TEXT, REGEX_COMPLIANCE_MESSAGE_TEXT } from "../../../utils/constants"
import { renderMessageWithUser } from "../../../utils/useMessage"
import { FormHandle } from "../../SettingsStack/profile/ProfileScreen"

interface IProps {
  data: IComplianceMessageMessageUpdate
  onSubmit: (data: IComplianceMessageMessageUpdate) => void
  userProfile: IUserProfile
}

const COMPLIANCE_LIBRAY = [
  "#company: You can call or text us at this number. Primarily, you can expect to receive brief news and updates from us. Msg & data rates may apply. Reply STOP to opt-out anytime. Questions? You are welcome to reply.",
  "This is a business texting number for #company. Primarily, this number will be used for quick updates and correspondence. You can opt-out of texts anytime by replying STOP.",
  "This is #firstname #lastname from #company. Feel free to reach out to me over text here! You can opt-out of text updates from me by replying STOP if you prefer.",
  "This is #firstname #lastname. I use this number for all my business texting. Please save it to your phone and reach out to me if you need anything. You can also opt-out by replying STOP if you prefer.",
]

export const schema = yup.object().shape({
  Message: yup
    .string()
    .matches(
      REGEX_COMPLIANCE_MESSAGE_TEXT,
      `Needs to say something like:  ${COMPLIANCE_MESSAGE_TEXT}`,
    )
    .max(300, "Too long (300 Characters please)")
    .required("Required"),
})

export const EditComplianceMessageForm = React.forwardRef<FormHandle, IProps>(
  ({ onSubmit, data, userProfile }, ref) => {
    const [renderedMessageLibrary, setRenderedMessageLibrary] = React.useState<string[]>([])

    const form = useForm<IComplianceMessageMessageUpdate>({
      resolver: yupResolver(schema),
      defaultValues: data,
    })

    const handleOnInvalid = () => {}

    const handleOnValid = (data: IComplianceMessageMessageUpdate) => {
      onSubmit(data)
    }

    const handleOnUseMessage = (msgBody: string) => {
      form.setValue("Message", msgBody)
    }

    React.useImperativeHandle(ref, () => ({
      // start() has type inferrence here
      submitForm() {
        form.handleSubmit(handleOnValid, handleOnInvalid)()
      },
    }))

    React.useEffect(() => {
      if (userProfile) {
        const parsedTemplates: string[] = COMPLIANCE_LIBRAY.map((template) => {
          const renderedMsg = renderMessageWithUser(template, userProfile)
          return renderedMsg
        })
        setRenderedMessageLibrary(parsedTemplates)
      }
    }, [userProfile, COMPLIANCE_LIBRAY])

    return (
      <Stack space={spacing.tiny} py={spacing.tiny} px={spacing.tiny}>
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
            {renderedMessageLibrary.map((msgBody, idx) => {
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
