import { Box, HStack, IStackProps } from "native-base"
import React from "react"
import { AutoImage, Icon, IconButton } from "../../components"
import { IMessageMediaItem } from "../../models/Message"

import { IUserMediaItem } from "../../models/UserMediaItem"
import { spacing } from "../../theme"
import { useColor } from "../../theme/useColor"

interface IProps extends IStackProps {
  mediaItems: IMessageMediaItem[]
  setMediaItems: React.Dispatch<React.SetStateAction<IUserMediaItem[]>>
}

const MessageMediaItemsThumbnails = ({ mediaItems, setMediaItems, ...stackProps }: IProps) => {
  const bgMain = useColor("bg.main")

  const handleRemove = (idx: number) => {
    setMediaItems((medItem) => medItem.filter((img, i) => i !== idx))
  }

  return (
    <HStack space={spacing.micro} flexWrap="wrap" {...stackProps}>
      {mediaItems.map((mediaItem, idx) => {
        const isPdfFile = mediaItem?.MediaType?.includes("pdf") ? true : false

        return (
          <Box key={`${idx}-${mediaItem.MediaUrl}`} position="relative">
            {/* Image */}
            <Box position="relative">
              <Box rounded="lg" overflow={"hidden"} minW={8}>
                <AutoImage
                  resizeMode="cover"
                  source={{
                    uri: isPdfFile
                      ? "https://cc-west-prd-bucket-users.s3.us-west-2.amazonaws.com/public/general/media/pdf-file.png"
                      : mediaItem.MediaUrl,
                  }}
                  maxWidth={80}
                  maxHeight={80}
                />
              </Box>
              {/* Remove button */}
              <Box position={"absolute"} top={-10} right={-10}>
                <IconButton
                  rounded="full"
                  borderWidth={2}
                  borderColor={bgMain}
                  size="xs"
                  onPress={() => handleRemove(idx)}
                  variant={"subtle"}
                  colorScheme="error"
                  aria-label="Remove media"
                  icon={<Icon colorToken="text.soft" size={12} icon="xMark"></Icon>}
                  tx="common.removeMedia"
                ></IconButton>
              </Box>
            </Box>
          </Box>
        )
      })}
    </HStack>
  )
}

export default MessageMediaItemsThumbnails
