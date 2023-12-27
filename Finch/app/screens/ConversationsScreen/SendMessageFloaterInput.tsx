/*
SendMessageFloaterInput
*/

import { yupResolver } from "@hookform/resolvers/yup"
import * as Haptics from "expo-haptics"
import { Box, HStack, Button as NBButton, Spinner, Stack, useColorModeValue } from "native-base"
import React from "react"
import { useForm } from "react-hook-form"
import { Keyboard } from "react-native"

import * as yup from "yup"
import { Icon, IconButton } from "../../components"
import { FormControl } from "../../components/FormControl"
import {
  IMessageCreate,
  IMessageMediaItem,
  MessageTypeEnum,
  formatPhoneNumberForMessage,
} from "../../models/Message"
import { ISmsTemplate } from "../../models/SmsTemplate"
import { IUserMediaItem } from "../../models/UserMediaItem"
import { runGetUserName, useUserPhone } from "../../models/UserProfile"
import useReadContact from "../../services/api/contacts/queries/useReadContact"
import useCreateSendMessage from "../../services/api/conversations/mutations/useCreateSendMessage"
import useReadUserProfile from "../../services/api/userprofile/queries/useReadUserProfile"
import { spacing } from "../../theme"
import { useColor } from "../../theme/useColor"
import { useCustomToast } from "../../utils/useCustomToast"
import { renderMessageClean, renderMessageWithContact } from "../../utils/useFormatMessage"
import { AttachFileButton } from "./AttachFileButton"
import ConversationRealtimeTyping from "./ConversationRealtimeTyping"
import MessageMediaItemsThumbnails from "./MessageMediaItemsThumbnails"
import { SelectTemplateButton } from "./SelectTemplateButton"

interface IProps {
  contactName: string
  contactNumber: string
  conversationId: string
  contactId?: string
  onSent?: () => void
  onEmitChange?: (message: string) => void
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

const SendMessageFloaterInput = ({
  contactName,
  conversationId,
  contactNumber,
  contactId,
  onSent,
  onEmitChange,
}: IProps) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const [messageMediaItems, setMessageMediaItems] = React.useState<
    (IUserMediaItem | IMessageMediaItem)[]
  >([])

  const bgMain = useColor("bg.main")
  const borderColor = useColorModeValue("gray.300", "gray.700")

  const toast = useCustomToast()

  const { data: userProfile } = useReadUserProfile()

  const {
    data: dataContact,
    isLoading: isLoadingContact,
    isError: isErrorContact,
  } = useReadContact(contactId, false)

  const userNumber = useUserPhone(userProfile)

  const { mutateAsync: mutateAsyncSend, isLoading: isLoadingSend } = useCreateSendMessage()

  const {
    control,
    handleSubmit,
    setValue,
    setError,
    reset,
    watch,
    formState: { errors, isValid },
  } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      message: "",
    },
  })

  const messageVal = watch("message")

  const resetInputs = () => {
    reset()
    setMessageMediaItems([])
    Keyboard.dismiss()
  }

  const handleEmitChange = (emitValue: string) => {
    if (onEmitChange) {
      onEmitChange(emitValue)
    }
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

      let messageBodyCleaned = fillinPlaceholdersInMessage(messageValue)

      try {
        const contactScrubbedNumber = formatPhoneNumberForMessage(contactNumber)
        const senderName = runGetUserName(userProfile)

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
          Message: messageBodyCleaned,
          MessageMediaItems: messageMediaItemsSend,
          Meta: {
            Source: "mobile",
            Type: MessageTypeEnum.CONVERSATION,
          },
          SenderMemberId: userProfile.TeamMemberUserId,
          SenderName: senderName,
        }

        try {
          await mutateAsyncSend(messageCreate)
          // appTrackLogEvent(AppTrackEventsEnum.MESSAGE_SENT)
          // let messageDraftUpdate = messageDrafts

          // if (contactId) {
          //   messageDraftUpdate[contactId] = {}
          // }
          if (onSent) {
            onSent()
          }

          resetInputs()
        } catch (e) {}
      } catch (e) {}

      setIsSubmitting(false)
    }
  }

  const handleOnTemplateSelected = React.useCallback(
    (smsTemplate: ISmsTemplate) => {
      let messageBodyUpdate = fillinPlaceholdersInMessage(smsTemplate.Message)

      if (!dataContact) {
        toast.warning({ title: "Review Message" })
      }

      setValue("message", messageBodyUpdate, { shouldValidate: true })

      if (smsTemplate.MessageMediaItems) {
        setMessageMediaItems(smsTemplate.MessageMediaItems)
      }
    },
    [dataContact],
  )

  const fillinPlaceholdersInMessage = (messageBody: string) => {
    let messageBodyUpdate = messageBody

    if (dataContact) {
      messageBodyUpdate = renderMessageWithContact(
        messageBodyUpdate,
        dataContact.FirstName,
        dataContact.LastName,
        dataContact.Nickname,
      )
    } else {
      messageBodyUpdate = renderMessageWithContact(messageBodyUpdate, "Friend", "Friend")
    }

    messageBodyUpdate = renderMessageClean(messageBodyUpdate)

    return messageBodyUpdate
  }

  React.useEffect(() => {
    handleEmitChange(messageVal)
  }, [messageVal])

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
      <ConversationRealtimeTyping color="amber.600" conversationId={conversationId} />

      <MessageMediaItemsThumbnails
        mediaItems={messageMediaItems}
        setMediaItems={setMessageMediaItems}
      />

      <Box>
        <FormControl
          py={3}
          maxH={32}
          isDisabled={isLoadingSend}
          name="message"
          control={control}
          multiline={true}
          placeholderTx="inbox.enterMessage"
          autoCapitalize="sentences"
          autoComplete="off"
          autoCorrect={true}
        ></FormControl>
      </Box>
      <HStack justifyContent={"space-between"}>
        <NBButton.Group space={spacing.micro}>
          {contactId && isLoadingContact && !isErrorContact ? (
            <Box>
              <Spinner />
            </Box>
          ) : (
            <>
              <SelectTemplateButton onTemplateSelect={handleOnTemplateSelected} />
              <AttachFileButton onFileSelect={handleOnFileSelected} />
            </>
          )}
        </NBButton.Group>
        <HStack space={spacing.micro} alignItems="center">
          {contactId && isLoadingSend && !isErrorContact ? (
            <Box>
              <Spinner />
            </Box>
          ) : null}

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
