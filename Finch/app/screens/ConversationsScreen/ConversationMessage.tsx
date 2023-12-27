// /*
// ConversationMessage
// */

import { Box, Center, HStack, Stack, View } from "native-base"
import { ColorType } from "native-base/lib/typescript/components/types"
import React from "react"
import { Icon, Text } from "../../components"
import { IMessage, IMessageVideoDetails } from "../../models/Message"
import { spacing } from "../../theme"
import { runFormatMinuteTime } from "../../utils/useFormatDate"
import MessageMediaItemsPreview from "./MessageMediaItemsPreview"
import { SenderAvatar } from "./SenderAvatar"
import TextMessageBubble from "./TextMessageBubble"
import VideoMessageDetailsPreview from "./VideoMessageDetailsPreview"

export interface IConversationMessageProps {
  mediaItems?: IMessage["MessageMediaItems"]
  message?: IMessage["Message"]
  createdTime?: IMessage["CreatedTime"]
  isMessageError?: boolean
  isMessageBlocked?: boolean
  isMessageSending?: boolean
  isAutoReply?: boolean
  isUserMessage?: boolean
  isCompliance?: boolean
  messageBroadcastId?: string
  messageCampaignId?: string
  contactColor?: ColorType
  contactInitials?: string
  contactId?: string
  messageStatus?: string
  videoDetails?: IMessageVideoDetails
  senderMemberId?: string
  senderName?: string
}

const ConversationMessage = ({
  mediaItems,
  message,
  createdTime,
  isMessageError,
  isMessageSending,
  isUserMessage,
  isMessageBlocked,
  isAutoReply,
  isCompliance,
  messageBroadcastId,
  messageCampaignId,
  contactColor,
  contactInitials,
  contactId,
  messageStatus,
  videoDetails,
  senderMemberId,
  senderName,
}: IConversationMessageProps) => {
  const isRobot = isAutoReply || isCompliance || !!messageBroadcastId || !!messageCampaignId

  const isError = isMessageError || isMessageBlocked

  return (
    <View
      w="full"
      // Put some contraint on it
      pl={isUserMessage ? spacing.extraSmall : 0}
      pr={!isUserMessage ? spacing.extraSmall : 0}
    >
      {/* Body */}
      <Stack flex={1} space={1} alignItems={isUserMessage ? "flex-end" : "flex-start"}>
        {/* Media */}
        {mediaItems && (
          <MessageMediaItemsPreview
            isUserMessage={isUserMessage}
            isMessageError={isError}
            isDownloadable={true}
            mediaItems={mediaItems}
          ></MessageMediaItemsPreview>
        )}

        {/* Message */}
        {message ? (
          <TextMessageBubble
            isMessageError={isError}
            isUserMessage={isUserMessage}
            message={message}
          />
        ) : null}

        {/* Video */}
        {videoDetails && (
          <VideoMessageDetailsPreview
            isUserMessage={isUserMessage}
            isMessageError={isMessageError || isMessageBlocked}
            videoDetails={videoDetails}
          ></VideoMessageDetailsPreview>
        )}

        {/* Meta */}
        {isMessageSending ? (
          <HStack
            alignItems={"center"}
            space={spacing.micro}
            pr={isUserMessage ? 2 : 0}
            pl={isUserMessage ? 0 : 2}
          >
            <Icon colorToken={"text.softer"} icon="paperAirplane" size={12}></Icon>
            <Text colorToken={"text.softer"} fontSize="xs" tx={"message.sending"}></Text>
          </HStack>
        ) : (
          <HStack
            color="gray.400"
            space={2}
            alignItems={"center"}
            direction={isUserMessage ? "row" : "row-reverse"}
          >
            {/* Message Types */}
            <Box pr={isUserMessage ? 2 : 0} pl={isUserMessage ? 0 : 2}>
              {isCompliance && (
                <HStack alignItems={"center"} space={spacing.micro}>
                  <Icon colorToken={"text.softer"} icon="scale" size={12}></Icon>
                  <Text colorToken={"text.softer"} fontSize="xs" tx={"message.compliance"}></Text>
                </HStack>
              )}

              {isAutoReply && (
                <HStack alignItems={"center"} space={spacing.micro}>
                  <Icon colorToken={"text.softer"} icon="bolt" size={12}></Icon>
                  <Text colorToken={"text.softer"} fontSize="xs" tx="message.autoreply"></Text>
                </HStack>
              )}

              {messageCampaignId && (
                <HStack alignItems={"center"} space={spacing.micro}>
                  <Icon colorToken={"text.softer"} icon="flag" size={12}></Icon>
                  <Text colorToken={"text.softer"} fontSize="xs" tx="message.campaign"></Text>
                </HStack>
              )}

              {messageBroadcastId && (
                <HStack alignItems={"center"} space={spacing.micro}>
                  <Icon colorToken={"text.softer"} icon="megaphone" size={12}></Icon>
                  <Text colorToken={"text.softer"} fontSize="xs" tx="message.broadcast"></Text>
                </HStack>
              )}

              {/* {messageCampaignId && (
                <Button
                  size="xs"
                  variant={"link"}
                  // onClick={handleViewCampaign}
                  aria-label="View campaign"
                  tx="campaigns.viewCampaign"
                ></Button>
              )}

              {messageBroadcastId && (
                <Button
                  size="xs"
                  variant={"link"}
                  // onClick={handleViewBroadcast}
                  tx="broadcasts.viewBroadcast"
                ></Button>
              )} */}
            </Box>

            {/* Message status */}
            <HStack space={2} alignItems={"center"}>
              {isError && messageStatus ? (
                <Text colorToken={"error"} fontSize="xs" text={messageStatus}></Text>
              ) : null}

              {isMessageError ? (
                <Center>
                  <Icon size={16} icon="exclamation-triangle" colorToken={"error"}></Icon>
                </Center>
              ) : null}

              {isMessageBlocked ? (
                <Center>
                  <Icon size={16} icon="noSymbol" colorToken={"error"}></Icon>
                </Center>
              ) : null}

              {/* Sender */}
              {isUserMessage ? (
                <Text
                  fontSize="sm"
                  fontWeight={"normal"}
                  colorToken={"text.softer"}
                  text={senderName}
                ></Text>
              ) : null}

              <Text
                fontSize="sm"
                fontWeight={"normal"}
                colorToken={"text.softer"}
                text={runFormatMinuteTime(createdTime)}
              ></Text>
            </HStack>

            <Box ml={isUserMessage ? 1 : 0} mr={!isUserMessage ? 1 : 0}>
              <SenderAvatar
                isRobotMessage={isRobot}
                isUserMessage={isUserMessage}
                senderMemberId={senderMemberId}
                senderName={senderName}
                contactId={contactId}
                contactInitials={contactInitials}
              ></SenderAvatar>
            </Box>
          </HStack>
        )}
      </Stack>
    </View>
  )
}

export default ConversationMessage
