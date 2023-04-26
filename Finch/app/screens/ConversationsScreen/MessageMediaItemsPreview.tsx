import * as Linking from "expo-linking"
import { Box, HStack, IStackProps, Spinner, Stack, useColorModeValue } from "native-base"
import React from "react"
import { AutoImage, Icon, IconButton } from "../../components"
import { IMessageMediaItem } from "../../models/Message"

import * as FileSystem from "expo-file-system"
import * as Haptics from "expo-haptics"
import * as MediaLibrary from "expo-media-library"
import * as WebBrowser from "expo-web-browser"
import { Pressable } from "react-native"
import { colors } from "../../theme"
import { useCustomToast } from "../../utils/useCustomToast"
import VCardMediaDisplay from "./VCardMediaDisplay"
interface IProps extends IStackProps {
  mediaItems: IMessageMediaItem[]
  isUserMessage?: boolean
  isMessageError?: boolean
  isDownloadable?: boolean
}

const MessageMediaItemsPreview = ({
  mediaItems,
  isUserMessage = false,
  isMessageError = false,
  isDownloadable = false,
  ...stackProps
}: IProps) => {
  const [isDownloading, setIsDownloading] = React.useState(false)
  const toast = useCustomToast()

  const borderError = useColorModeValue(colors.error[300], colors.error[600])

  const handleOnViewItem = (mediaUrl: string) => {
    Haptics.selectionAsync()
    if (mediaUrl) {
      WebBrowser.openBrowserAsync(mediaUrl)
    }
  }

  const handleDownload = async (mediaUrl: string, mediaType: string) => {
    const fileName = mediaUrl.split("/").pop()
    const ext = `.${mediaType.split("/").pop()}`

    const isVCard = mediaType?.toLowerCase().includes("vcard") ? true : false

    if (isVCard) {
      Linking.openURL(mediaUrl)
    } else {
      setIsDownloading(true)
      const isAvailable = await MediaLibrary.isAvailableAsync()

      if (isAvailable) {
        try {
          const localFileUrl = `${FileSystem.documentDirectory}${fileName}${ext}`

          await FileSystem.downloadAsync(mediaUrl, localFileUrl)
          await MediaLibrary.saveToLibraryAsync(localFileUrl)
          // const asset = await MediaLibrary.createAssetAsync(localFileUrl)

          toast.success({ title: "Download complete" })
        } catch (error) {
          toast.error({ title: "Download failed" })
        }
      } else {
        toast.warning({
          title: "Limited Permissions",
          description: "Required permissions not available",
        })
      }
      setIsDownloading(false)
    }
  }

  return (
    <Stack space={1} {...stackProps}>
      {mediaItems.map((mediaItem, idx) => {
        const isPdfFile = mediaItem?.MediaType?.includes("pdf") ? true : false
        const isVCard = mediaItem?.MediaType?.toLowerCase().includes("vcard") ? true : false

        return (
          <Box key={`${idx}-${mediaItem.MediaUrl}`} position="relative">
            <HStack direction={isUserMessage ? "row-reverse" : "row"} alignItems="center" w="full">
              {isVCard ? (
                <VCardMediaDisplay
                  isMessageError={isMessageError}
                  isUserMessage={isUserMessage}
                  mediaItem={mediaItem}
                ></VCardMediaDisplay>
              ) : (
                <Pressable onPress={() => handleOnViewItem(mediaItem.MediaUrl)}>
                  <Box
                    borderWidth={isMessageError ? 1 : 0}
                    borderColor={isMessageError ? borderError : "transparent"}
                    rounded="lg"
                    overflow={"hidden"}
                  >
                    <AutoImage
                      resizeMode="cover"
                      source={{
                        uri: isPdfFile
                          ? "https://cc-west-prd-bucket-users.s3.us-west-2.amazonaws.com/public/general/media/pdf-file.png"
                          : mediaItem.MediaUrl,
                      }}
                      maxWidth={200}
                    />
                  </Box>
                </Pressable>
              )}

              {isDownloadable ? (
                <Box ml={isUserMessage ? 0 : 2} mr={!isUserMessage ? 0 : 2}>
                  {isDownloading ? (
                    <Box p={2}>
                      <Spinner />
                    </Box>
                  ) : (
                    <IconButton
                      rounded="full"
                      size="md"
                      onPress={() => handleDownload(mediaItem.MediaUrl, mediaItem.MediaType)}
                      variant={"ghost"}
                      aria-label="Download Media"
                      icon={<Icon colorToken="text.soft" size={20} icon={"cloudArrowDown"}></Icon>}
                      tx="common.downloadMedia"
                    ></IconButton>
                  )}
                </Box>
              ) : null}
            </HStack>
          </Box>
        )
      })}
    </Stack>
  )
}

export default MessageMediaItemsPreview
