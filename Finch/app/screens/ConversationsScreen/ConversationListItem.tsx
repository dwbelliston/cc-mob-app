import { HStack, Pressable, Stack, useColorModeValue, View } from "native-base"
import React from "react"

import Swipeable from "react-native-gesture-handler/Swipeable"
import { Icon, Text } from "../../components"
import { AvatarRing } from "../../components/AvatarRing"
import {
  ConversationStatusEnum,
  IConversation,
  useConversationContactNumber,
  useConversationCreatedTime,
  useConversationIsIncoming,
  useConversationLastMessage,
} from "../../models/Conversation"
import { spacing, useAvatarColor } from "../../theme"
import { useColor } from "../../theme/useColor"
import { runFormatTimeFromNowSpecial } from "../../utils/useFormatDate"
import { runFormatPhoneSimple } from "../../utils/useFormatPhone"
import { useInitials } from "../../utils/useInitials"

interface IProps {
  conversation: IConversation
  // onClickConversation: (conversation: IConversation) => void;
}

const LeftSwipeActions = ({ conversation }: IProps) => {
  const statusBg = useColorModeValue("indigo.600", "indigo.800")

  return (
    <View px={spacing.extraSmall} justifyContent={"center"} bg={statusBg}>
      {conversation?.IsRead ? (
        <Stack alignItems={"center"}>
          <Icon color="white" icon="bellAlert"></Icon>
          <Text fontSize="xs" fontFamily={"mono"} color="white" fontWeight="semibold">
            Unread
          </Text>
        </Stack>
      ) : (
        <Stack alignItems={"center"}>
          <Icon color="white" icon="bellAlert"></Icon>
          <Text fontSize="xs" fontFamily={"mono"} color="white" fontWeight="semibold">
            Read
          </Text>
        </Stack>
      )}
    </View>
  )
}
const RightSwipeActions = ({ conversation }: IProps) => {
  const moreBg = useColorModeValue("gray.100", "gray.800")
  const statusBg = useColorModeValue("primary.600", "primary.800")

  const handleOnMore = () => {}
  const handleOnDone = () => {}

  return (
    <View bg={moreBg}>
      <HStack h={"full"}>
        <Pressable onPress={handleOnMore} bg={moreBg} w={24} px={spacing.micro}>
          <Stack h="full" alignItems={"center"} justifyContent="center">
            <Icon colorToken="text.soft" icon="ellipsisHorizontal"></Icon>
            <Text fontSize="xs" fontFamily={"mono"} colorToken="text.soft" fontWeight="semibold">
              More
            </Text>
          </Stack>
        </Pressable>

        <Pressable onPress={handleOnDone} bg={statusBg} w={24} px={spacing.micro}>
          <Stack h="full" alignItems={"center"} justifyContent="center">
            {conversation?.Status === ConversationStatusEnum.CLOSED ? (
              <>
                <Icon color="white" icon="fire"></Icon>
                <Text fontSize="xs" fontFamily={"mono"} color="white" fontWeight="semibold">
                  Active
                </Text>
              </>
            ) : (
              <>
                <Icon color="white" icon="check"></Icon>
                <Text fontSize="xs" fontFamily={"mono"} color="white" fontWeight="semibold">
                  Complete
                </Text>
              </>
            )}
          </Stack>
        </Pressable>
      </HStack>
    </View>
  )
}

const swipeFromOpen = (direction: "left" | "right") => {
  // alert(direction)
}

const ConversationListItem = ({ conversation }: IProps) => {
  const avatarColor = useAvatarColor(conversation.ContactName)
  const initials = useInitials(conversation.ContactName)

  const createdTime = useConversationCreatedTime(conversation)
  const conversationNumber = useConversationContactNumber(conversation)
  const conversationMessage = useConversationLastMessage(conversation)
  const isIncoming = useConversationIsIncoming(conversation)

  const errorColor = useColorModeValue("error.300", "error.400")
  const cardBg = useColor("bg.main")

  return (
    <Swipeable
      renderLeftActions={() => <LeftSwipeActions conversation={conversation} />}
      renderRightActions={() => <RightSwipeActions conversation={conversation} />}
      onSwipeableOpen={swipeFromOpen}
    >
      <HStack bg={cardBg} py={spacing.tiny} px={spacing.tiny} space={4} alignItems="center">
        <AvatarRing
          outerRingColor={isIncoming ? errorColor : cardBg}
          innerRingColor={cardBg}
          avatarColor={avatarColor}
          initials={initials}
        ></AvatarRing>

        <Stack flex={1}>
          <Text
            numberOfLines={1}
            colorToken={"text"}
            fontWeight="semibold"
            text={conversation.ContactName || runFormatPhoneSimple(conversationNumber)}
          ></Text>
          <HStack alignItems="center" space={spacing.micro}>
            {isIncoming ? <Icon size={16} color={errorColor} icon="arrowDownRight"></Icon> : null}
            <Text
              numberOfLines={1}
              fontSize="sm"
              colorToken={!conversation.IsRead ? "text" : "text.soft"}
              fontWeight={!conversation.IsRead ? "medium" : "normal"}
              text={isIncoming ? conversationMessage : `You: ${conversationMessage}`}
            ></Text>
          </HStack>
        </Stack>

        <HStack space={spacing.micro} alignItems="center">
          {createdTime && (
            <Text
              fontSize="xs"
              colorToken={"text.softer"}
              // whiteSpace={"nowrap"}
            >
              {runFormatTimeFromNowSpecial(createdTime)}
            </Text>
          )}
          <Icon colorToken={"text.softer"} icon="ellipsisVertical"></Icon>
        </HStack>
      </HStack>
    </Swipeable>
  )
}

export const PureConversationListItem = React.memo(ConversationListItem)
