import { Box, HStack, IStackProps, Spinner, Stack } from "native-base"
import React from "react"
import { AutoImage, Icon, IconButton } from "../../components"
import { IMessageMediaItem } from "../../models/Message"

import * as FileSystem from "expo-file-system"
import * as MediaLibrary from "expo-media-library"
import { useCustomToast } from "../../utils/useCustomToast"

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

  const handleDownload = async (mediaUrl: string, mediaType: string) => {
    const fileName = mediaUrl.split("/").pop()
    const ext = `.${mediaType.split("/").pop()}`

    const isAvailable = await MediaLibrary.isAvailableAsync()

    if (isAvailable) {
      setIsDownloading(true)
      try {
        const localFileUrl = `${FileSystem.documentDirectory}${fileName}${ext}`

        await FileSystem.downloadAsync(mediaUrl, localFileUrl)
        console.log("save to lib")
        await MediaLibrary.saveToLibraryAsync(localFileUrl)

        toast.success({ title: "Download complete" })
      } catch (error) {
        console.log("error", error)
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

  return (
    <Stack {...stackProps}>
      {mediaItems.map((mediaItem, idx) => {
        const isPdfFile = mediaItem?.MediaType?.includes("pdf") ? true : false
        const isVCard = mediaItem?.MediaType?.toLowerCase().includes("vcard") ? true : false

        return (
          <Stack key={`${idx}-${mediaItem.MediaUrl}`} position="relative" space={0}>
            {/* {isVCard ? (
              <VCardMediaDisplay
                isMessageError={isMessageError}
                isUserMessage={isUserMessage}
                mediaItem={mediaItem}
              ></VCardMediaDisplay>
            ) : ( */}

            <HStack direction={isUserMessage ? "row-reverse" : "row"} alignItems="center" w="full">
              {/* Image */}
              <Box
                borderWidth={isMessageError ? 2 : 0}
                borderColor={isMessageError ? "red.200" : "transparent"}
                rounded="lg"
                overflow={"hidden"}
              >
                {/* <Image
                resizeMode="contain"
                alt="media file"
                source={{
                  uri: isPdfFile
                    ? "https://cc-west-prd-bucket-users.s3.us-west-2.amazonaws.com/public/general/media/pdf-file.png"
                    : mediaItem.MediaUrl,
                }}
                maxWidth={300}
                maxHeight={300}
              /> */}
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
              {/* Download button */}
              <Box ml={isUserMessage ? 0 : 2} mr={!isUserMessage ? 0 : 2}>
                {isDownloading ? (
                  <Box p={2}>
                    <Spinner />
                  </Box>
                ) : (
                  <IconButton
                    rounded="full"
                    // href={mediaItem.MediaUrl}
                    size="md"
                    onPress={() => handleDownload(mediaItem.MediaUrl, mediaItem.MediaType)}
                    variant={"ghost"}
                    aria-label="Download Media"
                    icon={<Icon colorToken="text.soft" size={20} icon="cloudArrowDown"></Icon>}
                    tx="common.downloadMedia"
                  ></IconButton>
                )}
              </Box>
            </HStack>
          </Stack>
        )
      })}
    </Stack>
  )
}

export default MessageMediaItemsPreview
