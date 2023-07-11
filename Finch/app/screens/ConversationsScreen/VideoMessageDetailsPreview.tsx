import {
  AspectRatio,
  Box,
  Center,
  HStack,
  IStackProps,
  Image,
  Pressable,
  Stack,
  Text,
  useColorModeValue,
} from "native-base"

import * as Haptics from "expo-haptics"
import * as WebBrowser from "expo-web-browser"
import React from "react"
import { Icon } from "../../components"
import { IMessageVideoDetails } from "../../models/Message"
import { colors } from "../../theme"

interface IProps extends IStackProps {
  videoDetails: IMessageVideoDetails
  isUserMessage?: boolean
  isMessageError?: boolean
}

const VideoMessageDetailsPreview = ({
  videoDetails,
  isUserMessage = false,
  isMessageError = false,
  ...rest
}: IProps) => {
  const bgError = useColorModeValue(colors.error[50], colors.error[900])
  const borderError = useColorModeValue(colors.error[200], colors.error[600])

  const bgRight = useColorModeValue(colors.white, colors.gray[800])
  const bgLeft = useColorModeValue(colors.white, colors.gray[800])

  const colorBorder = useColorModeValue(colors.gray[200], colors.gray[700])
  const colorText = useColorModeValue(colors.gray[800], colors.white)

  const handleOnPress = () => {
    Haptics.selectionAsync()
    if (videoDetails.videoUrl) {
      WebBrowser.openBrowserAsync(videoDetails.videoUrl)
    }
  }

  return (
    <Pressable onPress={handleOnPress}>
      <Stack
        w="3/4"
        borderWidth={isMessageError ? "2px" : 1}
        bg={isMessageError ? bgError : isUserMessage ? bgRight : bgLeft}
        borderColor={isMessageError ? borderError : colorBorder}
        rounded="xl"
        roundedBottomLeft={isUserMessage ? "xl" : "2"}
        roundedBottomRight={isUserMessage ? "2" : "xl"}
        overflow={"hidden"}
        ml={isUserMessage ? "auto" : "inherit"}
        {...rest}
      >
        <Box h="full" flex={1} overflow={"hidden"} roundedTopLeft="xl" roundedTopRight="xl">
          <AspectRatio w="full" ratio={16 / 9} flex={1} minW="full">
            {videoDetails?.videoThumbnail ? (
              <Image
                flex={1}
                alt="Video thumbnail"
                resizeMode="cover"
                src={videoDetails.videoThumbnail}
                // fallbackSrc={ImagePlaceholderSrc.Md}
              ></Image>
            ) : (
              <Center h="full">
                <Stack color="gray.500" alignItems="center">
                  <Icon icon="videoCameraSlash"></Icon>
                  <Text color={colorText}>No Video Added</Text>
                </Stack>
              </Center>
            )}
          </AspectRatio>
        </Box>
        <Box px={4} py={2}>
          <HStack alignItems="center" space={4} justifyContent="space-between">
            <Stack space={0} flex={1}>
              <Text fontSize="xs" fontWeight="semibold" noOfLines={1} color={colorText}>
                {videoDetails.videoDisplayTitle}
              </Text>
              <Text fontSize="xs" color="gray.400" noOfLines={1}>
                currentclient.com
              </Text>
            </Stack>
            <Icon size={16} color={colorText} icon="chevronRight"></Icon>
          </HStack>
        </Box>
      </Stack>
    </Pressable>
  )
}

export default VideoMessageDetailsPreview
