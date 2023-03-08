import { Box, HStack, IBoxProps, Stack } from "native-base"
import React from "react"
import { Icon, Text } from "../../components"
import { IMessageMediaItem } from "../../models/Message"
import { spacing } from "../../theme"

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

  React.useEffect(() => {
    const fileNameUpdate = mediaItem.MediaUrl.split("/").pop()
    if (fileNameUpdate) {
      set_fileName(fileNameUpdate)
    }
  }, [mediaItem])
  return (
    <Box
      bg={isMessageError ? "red.50" : isUserMessage ? "primary.50" : "white"}
      borderColor={isMessageError ? "red.200" : isUserMessage ? "primary.200" : "gray.200"}
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
        <Icon size={24} icon="identification"></Icon>
        <Stack space={0}>
          <Text tx="inbox.contactCard"></Text>
          {/* <Text fontSize="sm" color="gray.500">
            {fileName}
          </Text> */}
        </Stack>
      </HStack>
    </Box>
  )
}

export default VCardMediaDisplay
