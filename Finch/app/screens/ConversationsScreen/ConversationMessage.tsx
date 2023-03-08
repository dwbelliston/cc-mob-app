// /*
// ConversationMessage
// */

import { Box, Center, HStack, Stack, View } from "native-base"
import { ColorType } from "native-base/lib/typescript/components/types"
import React from "react"
import { Button, Icon, Text } from "../../components"
import { ContactAvatar } from "../../components/ContactAvatar"
import { CurrentClientAvatar } from "../../components/CurrentClientAvatar"
import { UserAvatar } from "../../components/UserAvatar"
import { IMessage } from "../../models/Message"
import { spacing } from "../../theme"
import { runFormatMinuteTime } from "../../utils/useFormatDate"
import MessageMediaItemsPreview from "./MessageMediaItemsPreview"
import TextMessageBubble from "./TextMessageBubble"

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
  messageStatus?: string
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
  messageStatus,
}: IConversationMessageProps) => {
  const isRobot = isAutoReply || isCompliance || !!messageBroadcastId || messageCampaignId

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
                  variant={"subtle"}
                  // onClick={handleViewBroadcast}
                  tx="broadcasts.viewBroadcast"
                ></Button>
              )}
            </Box>

            {/* Message status */}
            <HStack space={2}>
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

              <Text
                fontSize="xs"
                fontWeight={isError ? "semibold" : "normal"}
                colorToken={isError ? "error" : "text.softer"}
                text={runFormatMinuteTime(createdTime)}
              ></Text>
            </HStack>

            <Box ml={isUserMessage ? 1 : 0} mr={!isUserMessage ? 1 : 0}>
              {isUserMessage ? (
                <>
                  {isRobot ? (
                    <Box p={1}>
                      <CurrentClientAvatar size="sm" />
                    </Box>
                  ) : (
                    <UserAvatar isShowLoading={false} size="sm"></UserAvatar>
                  )}
                </>
              ) : (
                <ContactAvatar
                  // innerRingColor={"red.400"}
                  avatarColor={contactColor}
                  initials={contactInitials}
                  avatarProps={{ size: "sm" }}
                ></ContactAvatar>
              )}
            </Box>
          </HStack>
        )}
      </Stack>
    </View>
  )
}

export default ConversationMessage
