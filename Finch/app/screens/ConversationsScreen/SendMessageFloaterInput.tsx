/*
SendMessageFloaterInput
*/

import { yupResolver } from "@hookform/resolvers/yup"
import { Box, Button as NBButton, HStack, Stack } from "native-base"
import React from "react"
import { useForm } from "react-hook-form"
import { Keyboard } from "react-native"
import * as yup from "yup"
import { Icon, IconButton } from "../../components"
import { FormControl } from "../../components/FormControl"
import {
  formatPhoneNumberForMessage,
  IMessageCreate,
  IMessageMediaItem,
  MessageTypeEnum,
} from "../../models/Message"
import { useUserPhone } from "../../models/UserProfile"
import useCreateSendMessage from "../../services/api/conversations/mutations/useCreateSendMessage"
import useReadUserProfile from "../../services/api/userprofile/queries/useReadUserProfile"
import { spacing } from "../../theme"
import { useColor } from "../../theme/useColor"

interface IProps {
  contactName: string
  contactNumber: string
  contactId: string
}

type IFormInputs = {
  message: string
}

const schema = yup.object({
  message: yup.string().required("Required"),
})

const SendMessageFloaterInput = ({ contactName, contactNumber, contactId }: IProps) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const bgMain = useColor("bg.main")
  const borderColor = useColor("bg.high")

  const { data: userProfile } = useReadUserProfile()

  const userNumber = useUserPhone(userProfile)

  const { mutateAsync: mutateAsyncSend, isLoading: isLoadingSend } = useCreateSendMessage()

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isValid },
  } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      message: "",
    },
  })

  const handleOnSend = async (data: IFormInputs) => {
    const messageValue = data.message
    if (
      contactNumber &&
      // (data.message || messageMediaItems || vcardItems) &&
      userNumber
    ) {
      setIsSubmitting(true)

      try {
        const contactScrubbedNumber = formatPhoneNumberForMessage(contactNumber)

        let messageMediaItemsSend: IMessageMediaItem[] = []
        // let messageMediaItemsSend: IMessageMediaItem[] = messageMediaItems.map(
        //   (mediaItem) => {
        //     return {
        //       MediaUrl: mediaItem.MediaUrl,
        //       MediaType: mediaItem.MediaType,
        //     };
        //   }
        // );

        // if (vcardItems) {
        //   const vcardItemsSend: IMessageMediaItem[] = vcardItems.map(
        //     (vcardItem) => {
        //       return {
        //         MediaUrl: vcardItem.VCardUrl,
        //         MediaType: "text/vcard",
        //       };
        //     }
        //   );

        //   messageMediaItemsSend = messageMediaItemsSend.concat(vcardItemsSend);
        // }

        const messageCreate: IMessageCreate = {
          UserId: userProfile.UserId,
          UserNumber: userNumber,
          MessagingServiceId: userProfile.MessagingServiceId,
          ContactId: contactId,
          ContactNumber: contactScrubbedNumber,
          ContactName: contactName,
          Message: messageValue,
          MessageMediaItems: messageMediaItemsSend,
          Meta: {
            Source: "mobile",
            Type: MessageTypeEnum.CONVERSATION,
          },
        }

        try {
          await mutateAsyncSend(messageCreate)
          // appTrackLogEvent(AppTrackEventsEnum.MESSAGE_SENT)
          // let messageDraftUpdate = messageDrafts

          // if (contactId) {
          //   messageDraftUpdate[contactId] = {}
          // }

          reset()
          Keyboard.dismiss()
        } catch (e) {}
      } catch (e) {}

      setIsSubmitting(false)
    }
  }

  return (
    <Stack
      backgroundColor={bgMain}
      px={spacing.tiny}
      pt={spacing.tiny}
      pb={spacing.micro}
      space={spacing.micro}
      borderTopWidth={1}
      borderColor={borderColor}
    >
      <Box>
        <FormControl
          name="message"
          control={control}
          multiline={true}
          textContentType="username"
          placeholderTx="inbox.enterMessage"
          autoCapitalize="sentences"
          autoComplete="email"
          autoCorrect={false}
        ></FormControl>
      </Box>
      <HStack justifyContent={"space-between"}>
        <NBButton.Group>
          <IconButton
            rounded="full"
            size="sm"
            icon={<Icon colorToken={"text"} icon="documentDuplicate" size={16} />}
          />

          <IconButton
            rounded="full"
            size="sm"
            icon={<Icon colorToken={"text"} icon="paperClip" size={16} />}
          />
        </NBButton.Group>
        <Box>
          <IconButton
            onPress={handleSubmit(handleOnSend)}
            rounded="full"
            size="sm"
            isDisabled={!isValid}
            colorScheme={"primary"}
            icon={<Icon icon="arrowUp" size={16} />}
          />
        </Box>
      </HStack>
    </Stack>
  )
}

export default SendMessageFloaterInput
