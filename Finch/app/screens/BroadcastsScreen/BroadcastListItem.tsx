// https://beta.reactjs.org/reference/react/memo#minimizing-props-changes

import { Box, HStack, Pressable, Stack, useColorModeValue } from "native-base"
import React from "react"
import { Text } from "../../components"
import { BroadcastStatusEnum, IBroadcast } from "../../models/Broadcast"
import { spacing } from "../../theme"
import { runFormatDateWithAt } from "../../utils/useFormatDate"

import { useSharedValue } from "react-native-reanimated"
import { AnimatedBackground } from "../../components/AnimatedBackground"
import { BroadcastStatus } from "./BroadcastStatus"

export interface IBroadcastListItemData {
  BroadcastId: string
  Title: string
  Description: string
  IsSendingBroadcast: boolean
  Status: BroadcastStatusEnum
  CreatedAt: string
  StatSendComplete: number
}

export interface IBroadcastListItem extends IBroadcastListItemData {
  onViewBroadcast: ({ title, broadcastId }: { title: string; broadcastId: string }) => void
}

export const makeBroadcastListItemData = (broadcast: IBroadcast): IBroadcastListItemData => {
  return {
    BroadcastId: broadcast.BroadcastId,
    Title: broadcast.Title,
    Description: broadcast.Description,
    IsSendingBroadcast: broadcast.IsSendingBroadcast,
    Status: broadcast.Status,
    CreatedAt: runFormatDateWithAt(broadcast.CreatedAt),
    StatSendComplete: broadcast.StatSendComplete,
  }
}

const BroadcastListItem = (props: IBroadcastListItem) => {
  const progress = useSharedValue(0)

  const cardBorder = useColorModeValue("gray.200", "gray.700")

  const handleOnClickBroadcast = () => {
    progress.value = 1
    props.onViewBroadcast({ title: props.Title, broadcastId: props.BroadcastId })
  }

  return (
    <Pressable px={spacing.tiny} onPress={handleOnClickBroadcast}>
      <AnimatedBackground
        sharedValue={progress}
        bgStart="bg.main"
        bgEnd={"bg.high"}
        styles={{ borderRadius: 12 }}
      >
        <HStack
          borderColor={cardBorder}
          borderWidth={1}
          rounded="lg"
          py={spacing.tiny}
          px={spacing.tiny}
          space={2}
          alignItems="center"
        >
          <Stack flex={1}>
            <Text
              flex={1}
              numberOfLines={1}
              colorToken={"text"}
              fontWeight="semibold"
              fontSize="md"
              text={props.Title}
            ></Text>

            <HStack alignItems="center" space={spacing.micro} justifyContent={"space-between"}>
              <Box flex={1}>
                <BroadcastStatus.Type
                  flex={1}
                  numberOfLines={1}
                  maxH={12}
                  colorToken={"text.soft"}
                  status={props.Status}
                />
              </Box>
              <Text flex={1} textAlign={"right"} fontSize="xs" colorToken={"text.softer"}>
                {props.CreatedAt}
              </Text>
            </HStack>
          </Stack>
        </HStack>
      </AnimatedBackground>
    </Pressable>
  )
}

export const PureBroadcastListItem = React.memo(BroadcastListItem)
