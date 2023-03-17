/*
SendMessageFloaterInput
*/

import { yupResolver } from "@hookform/resolvers/yup"
import * as Haptics from "expo-haptics"
import { Box, Button as NBButton, HStack, Spinner, Stack, useColorModeValue } from "native-base"
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
import { ISmsTemplate } from "../../models/SmsTemplate"
import { IUserMediaItem } from "../../models/UserMediaItem"
import { useUserPhone } from "../../models/UserProfile"
import useReadContact from "../../services/api/contacts/queries/useReadContact"
import useCreateSendMessage from "../../services/api/conversations/mutations/useCreateSendMessage"
import useReadUserProfile from "../../services/api/userprofile/queries/useReadUserProfile"
import { spacing } from "../../theme"
import { useColor } from "../../theme/useColor"
import { useCustomToast } from "../../utils/useCustomToast"
import { renderMessageWithContact } from "../../utils/useFormatMessage"
import { AttachFileButton } from "./AttachFileButton"
import MessageMediaItemsThumbnails from "./MessageMediaItemsThumbnails"
import { SelectTemplateButton } from "./SelectTemplateButton"

interface IProps {
  contactName: string
  contactNumber: string
  contactId: string
}

type IFormInputs = {
  message: string
}

const schema = yup.object({
  message: yup.string(),
  // .required("Required"),
})

export interface ISelectedFile {
  file?: File
  uri: string
  type: string
  size?: number
  name: string
}

const SendMessageFloaterInput = ({ contactName, contactNumber, contactId }: IProps) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [messageMediaItems, setMessageMediaItems] = React.useState<IUserMediaItem[]>([])

  const bgMain = useColor("bg.main")
  const borderColor = useColorModeValue("gray.300", "gray.700")

  const toast = useCustomToast()

  const { data: userProfile } = useReadUserProfile()

  const { data: dataContact } = useReadContact(contactId)

  const userNumber = useUserPhone(userProfile)

  const { mutateAsync: mutateAsyncSend, isLoading: isLoadingSend } = useCreateSendMessage()

  const {
    control,
    handleSubmit,
    setValue,
    setError,
    reset,
    formState: { errors, isValid },
  } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      message: "",
    },
  })

  const resetInputs = () => {
    reset()
    setMessageMediaItems([])
    Keyboard.dismiss()
  }

  const handleOnFileSelected = (newMediaItem: IUserMediaItem) => {
    const messageMediaItemsUpdate = messageMediaItems.map((mediaItem) => mediaItem)

    messageMediaItemsUpdate.push(newMediaItem)

    setMessageMediaItems(messageMediaItemsUpdate)
  }

  const handleOnSend = async (data: IFormInputs) => {
    Haptics.selectionAsync()

    const messageValue = data.message

    if (!messageValue && !messageMediaItems.length) {
      setError("message", { message: "Add message" })
      return
    }

    if (contactNumber && userNumber) {
      setIsSubmitting(true)

      try {
        const contactScrubbedNumber = formatPhoneNumberForMessage(contactNumber)

        let messageMediaItemsSend: IMessageMediaItem[] = messageMediaItems.map((mediaItem) => {
          return {
            MediaUrl: mediaItem.MediaUrl,
            MediaType: mediaItem.MediaType,
          }
        })

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

          resetInputs()
        } catch (e) {}
      } catch (e) {}

      setIsSubmitting(false)
    }
  }

  const handleOnTemplateSelected = React.useCallback(
    (smsTemplate: ISmsTemplate) => {
      let messageBodyUpdate = smsTemplate.Message

      if (dataContact) {
        messageBodyUpdate = renderMessageWithContact(
          messageBodyUpdate,
          dataContact.FirstName,
          dataContact.LastName,
        )
        setValue("message", messageBodyUpdate, { shouldValidate: true })
      }
    },
    [dataContact],
  )

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
      <MessageMediaItemsThumbnails
        mediaItems={messageMediaItems}
        setMediaItems={setMessageMediaItems}
      />

      <Box>
        <FormControl
          isDisabled={isLoadingSend}
          name="message"
          control={control}
          multiline={true}
          textContentType="username"
          placeholderTx="inbox.enterMessage"
          autoCapitalize="sentences"
          autoComplete="email"
          autoCorrect={true}
        ></FormControl>
      </Box>
      <HStack justifyContent={"space-between"}>
        <NBButton.Group space={spacing.micro}>
          <SelectTemplateButton onTemplateSelect={handleOnTemplateSelected} />
          <AttachFileButton onFileSelect={handleOnFileSelected} />
        </NBButton.Group>
        <HStack space={spacing.micro} alignItems="center">
          {isLoadingSend && (
            <Box>
              <Spinner />
            </Box>
          )}

          <IconButton
            onPress={handleSubmit(handleOnSend)}
            rounded="full"
            size="sm"
            isDisabled={(!isValid && !messageMediaItems?.length) || isLoadingSend}
            colorScheme={"primary"}
            icon={<Icon icon="arrowUp" size={16} />}
          />
        </HStack>
      </HStack>
    </Stack>
  )
}

export default SendMessageFloaterInput
