/*
TextMessageBubble
*/

import { useActionSheet } from "@expo/react-native-action-sheet"
import * as Clipboard from "expo-clipboard"
import * as Haptics from "expo-haptics"
import { Box, IBoxProps, ITextProps, Link, Stack, Text, useColorModeValue } from "native-base"
import React from "react"
import { translate } from "../../i18n"
import { colors } from "../../theme"

interface IProps extends IBoxProps {
  message?: string
  isUserMessage?: boolean
  isMessageError?: boolean
  textProps?: ITextProps
}

interface IMessagePart {
  message: string
  isLink?: boolean
}

const TextMessageBubble = (props: IProps) => {
  const { message = "", textProps, isUserMessage = false, isMessageError = false, ...rest } = props

  const [messageParts, set_messageParts] = React.useState<IMessagePart[]>([])

  const bgError = useColorModeValue(colors.error[50], colors.error[900])
  const borderError = useColorModeValue(colors.error[200], colors.error[600])
  const colorError = useColorModeValue(colors.gray[800], colors.error[200])

  const bgRight = useColorModeValue(colors.blue[50], colors.blue[800])
  const borderRight = useColorModeValue(colors.blue[200], colors.blue[600])
  const colorRight = useColorModeValue(colors.gray[800], colors.white)

  const bgLeft = useColorModeValue(colors.white, colors.gray[800])
  const borderLeft = useColorModeValue(colors.gray[200], colors.gray[700])
  const colorLeft = useColorModeValue(colors.gray[800], colors.white)

  const { showActionSheetWithOptions } = useActionSheet()

  const onCopyText = async () => {
    await Clipboard.setStringAsync(message)
    Haptics.notificationAsync()
  }

  // const handleOnLongPress = () => {
  //   console.log("handleOnLongPress")
  //   toast.success({ title: "test" })
  // }

  const handleOnLongPress = () => {
    Haptics.selectionAsync()
    const options = ["Copy", "Cancel"]
    const destructiveButtonIndex = 0
    const cancelButtonIndex = 1

    showActionSheetWithOptions(
      {
        title: translate("stream.messageOptions"),
        options,
        cancelButtonIndex,
        // destructiveButtonIndex,
      },
      (selectedIndex: number) => {
        switch (selectedIndex) {
          case 0:
            // View Contact
            onCopyText()
            break

          case cancelButtonIndex:
          // Canceled
        }
      },
    )
  }

  React.useEffect(() => {
    let messagePartsUpdate: IMessagePart[] = []

    if (message) {
      const messagePartsStrings = message.split(/\r?\n/)

      messagePartsStrings.forEach((messagePart, index) => {
        const trimmed = messagePart.trim()
        const messagePartItem = {
          message: trimmed,
          isLink: false,
        }

        if (trimmed.startsWith("https://")) {
          messagePartItem.isLink = true
        }

        messagePartsUpdate.push(messagePartItem)
      })
    }

    set_messageParts(messagePartsUpdate)
  }, [message])

  return (
    <Box
      p={2}
      rounded="xl"
      roundedBottomLeft={isUserMessage ? "xl" : "2"}
      roundedBottomRight={isUserMessage ? "2" : "xl"}
      // shadow={0}
      py={3}
      px={4}
      bg={isMessageError ? bgError : isUserMessage ? bgRight : bgLeft}
      borderColor={isMessageError ? borderError : isUserMessage ? borderRight : borderLeft}
      borderWidth={1}
      {...rest}
    >
      <Stack space={1}>
        {messageParts.map((part, idx) => {
          if (part.isLink) {
            return (
              <Box key={idx}>
                <Link
                  textDecoration={"underline"}
                  _hover={{ color: "blue.200" }}
                  isExternal
                  _text={{
                    color: "blue.500",
                  }}
                  href={part.message}
                >
                  {part.message}
                </Link>
              </Box>
            )
          }

          return (
            <Text
              color={isMessageError ? colorError : isUserMessage ? colorRight : colorLeft}
              {...textProps}
              key={idx}
              fontFamily="plain"
              onLongPress={handleOnLongPress}
              suppressHighlighting={true}
              // selectable={true}
            >
              {part.message}
            </Text>
          )
        })}
      </Stack>
    </Box>
  )
}

export default TextMessageBubble
