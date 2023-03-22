import { Box, HStack, IBoxProps, Stack, useColorModeValue } from "native-base"
import React from "react"
import { Icon, Text } from "../../components"
import { IMessageMediaItem } from "../../models/Message"
import { colors, spacing } from "../../theme"

interface IProps extends IBoxProps {
  mediaItem: IMessageMediaItem
  isUserMessage?: boolean
  isMessageError?: boolean
}

const VCardMediaDisplay = ({
  mediaItem,
  isUserMessage = false,
  isMessageError = false,
  ...rest
}: IProps) => {
  const [fileName, set_fileName] = React.useState("")

  const bgError = useColorModeValue(colors.error[50], colors.error[900])
  const borderError = useColorModeValue(colors.error[200], colors.error[600])
  const colorError = useColorModeValue(colors.error[800], colors.error[200])

  const bgRight = useColorModeValue(colors.blue[50], colors.blue[800])
  const borderRight = useColorModeValue(colors.blue[200], colors.blue[600])
  const colorRight = useColorModeValue(colors.gray[800], colors.white)

  const bgLeft = useColorModeValue(colors.white, colors.gray[800])
  const borderLeft = useColorModeValue(colors.gray[200], colors.gray[700])
  const colorLeft = useColorModeValue(colors.gray[800], colors.white)

  React.useEffect(() => {
    const fileNameUpdate = mediaItem.MediaUrl.split("/").pop()
    if (fileNameUpdate) {
      set_fileName(fileNameUpdate)
    }
  }, [mediaItem])

  return (
    <Box
      bg={isMessageError ? bgError : isUserMessage ? bgRight : bgLeft}
      borderColor={isMessageError ? borderError : isUserMessage ? borderRight : borderLeft}
      borderWidth={"1px"}
      rounded="lg"
      shadow="sm"
      px={4}
      py={4}
      position="relative"
      justifyContent={"space-between"}
      {...rest}
    >
      <HStack space={spacing.tiny} alignItems="center">
        <Icon
          color={isMessageError ? colorError : isUserMessage ? colorRight : colorLeft}
          size={24}
          icon="identification"
        ></Icon>
        <Stack space={0}>
          <Text
            color={isMessageError ? colorError : isUserMessage ? colorRight : colorLeft}
            tx="inbox.contactCard"
          ></Text>
          {/* <Text fontSize="sm" color="gray.500">
            {fileName}
          </Text> */}
        </Stack>
      </HStack>
    </Box>
  )
}

export default VCardMediaDisplay
