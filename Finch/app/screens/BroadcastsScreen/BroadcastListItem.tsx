// https://beta.reactjs.org/reference/react/memo#minimizing-props-changes

import { HStack, Pressable, Spinner, Stack, useColorModeValue } from "native-base"
import React from "react"
import { Icon, Text } from "../../components"
import { BroadcastStatusEnum, IBroadcast } from "../../models/Broadcast"
import { spacing } from "../../theme"

import { useSharedValue } from "react-native-reanimated"
import { AnimatedBackground } from "../../components/AnimatedBackground"
import { BroadcastStatus } from "./BroadcastStatus"

export interface IBroadcastListItemData {
  BroadcastId: string
  Title: string
  Description: string
  IsSendingBroadcast: boolean
  Status: BroadcastStatusEnum
  StatSendComplete: number
  IsHasMedia: boolean
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
    StatSendComplete: broadcast.StatSendComplete,
    IsHasMedia: !!broadcast.MessageMediaItems?.length,
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
            <HStack alignItems="center" space={spacing.micro} justifyContent={"space-between"}>
              <Text
                flex={1}
                numberOfLines={1}
                colorToken={"text"}
                fontWeight="semibold"
                fontSize="md"
                text={props.Title}
              ></Text>
              {props.IsHasMedia ? <Icon colorToken={"text.soft"} size={20} icon="photo" /> : null}
            </HStack>

            <HStack alignItems="center" space={spacing.micro} justifyContent={"space-between"}>
              {props.IsSendingBroadcast ? (
                <>
                  <Spinner></Spinner>
                  <Text
                    textAlign={"right"}
                    fontSize="sm"
                    colorToken={"text.softer"}
                    tx="broadcasts.sending"
                  ></Text>
                </>
              ) : (
                <BroadcastStatus.Type
                  numberOfLines={1}
                  maxH={12}
                  colorToken={"text.soft"}
                  status={props.Status}
                />
              )}

              <Text flex={1} textAlign={"right"} fontSize="sm" colorToken={"text.softer"}>
                {props.StatSendComplete} sent
              </Text>
            </HStack>
          </Stack>
        </HStack>
      </AnimatedBackground>
    </Pressable>
  )
}

export const PureBroadcastListItem = React.memo(BroadcastListItem)
