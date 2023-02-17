import * as Haptics from "expo-haptics"
import { Box, HStack, Pressable, Stack, useColorModeValue, View } from "native-base"
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
  useConversationIsLastACall,
  useConversationIsLastAMessage,
  useConversationLastMessage,
} from "../../models/Conversation"
import { spacing, useAvatarColor } from "../../theme"
import { useColor } from "../../theme/useColor"
import { runFormatTimeFromNowSpecial } from "../../utils/useFormatDate"
import { runFormatPhoneSimple } from "../../utils/useFormatPhone"
import { useInitials } from "../../utils/useInitials"

import { useActionSheet } from "@expo/react-native-action-sheet"
import { Dot } from "../../components/Dot"

interface IProps {
  conversation: IConversation
}

interface ILeftActions extends IProps {
  onMarkUnread: () => void
  onMarkRead: () => void
}

interface IRightActions extends IProps {
  onBlock: () => void
  onViewContact: () => void
  onMarkActive: () => void
  onMarkComplete: () => void
}

interface IConversationListItem extends IRightActions, ILeftActions {
  // onClickConversation: (conversation: IConversation) => void;
}

const LeftSwipeActions = ({ conversation, onMarkRead, onMarkUnread }: ILeftActions) => {
  const unreadBg = useColorModeValue("error.200", "error.300")
  const unreadColor = useColorModeValue("error.900", "error.900")
  const readBg = useColorModeValue("success.100", "success.300")
  const readColor = useColorModeValue("success.900", "success.900")

  const statusBg = conversation.IsRead ? unreadBg : readBg

  return (
    <View bg={statusBg}>
      {conversation?.IsRead ? (
        <Pressable onPress={onMarkUnread} w={32} px={spacing.tiny}>
          <Stack h="full" alignItems={"center"} justifyContent="center">
            <Icon color={unreadColor} icon="bellAlert"></Icon>
            <Text fontSize="xs" fontFamily={"mono"} color={unreadColor} fontWeight="semibold">
              Unread
            </Text>
          </Stack>
        </Pressable>
      ) : (
        <Pressable onPress={onMarkRead} w={32} px={spacing.tiny}>
          <Stack h="full" alignItems={"center"} justifyContent="center">
            <Icon color={readColor} icon="check"></Icon>
            <Text fontSize="xs" fontFamily={"mono"} color={readColor} fontWeight="semibold">
              Read
            </Text>
          </Stack>
        </Pressable>
      )}
    </View>
  )
}
const RightSwipeActions = ({
  conversation,
  onViewContact,
  onBlock,
  onMarkActive,
  onMarkComplete,
}: IRightActions) => {
  const moreBg = useColorModeValue("gray.100", "gray.800")
  const statusBg = useColorModeValue("primary.600", "primary.800")

  const { showActionSheetWithOptions } = useActionSheet()
  const conversationNumber = useConversationContactNumber(conversation)
  const title = conversation.ContactName || runFormatPhoneSimple(conversationNumber)

  const isClosed = conversation?.Status === ConversationStatusEnum.CLOSED

  const handleOnMore = () => {
    const options = ["Block Number", "View Contact", "Cancel"]
    const destructiveButtonIndex = 0
    const cancelButtonIndex = 2

    showActionSheetWithOptions(
      {
        title,
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      (selectedIndex: number) => {
        switch (selectedIndex) {
          case 1:
            // View Contact
            onViewContact()
            break

          case destructiveButtonIndex:
            onBlock()
            // Block
            break

          case cancelButtonIndex:
          // Canceled
        }
      },
    )
  }

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

        {isClosed ? (
          <Pressable onPress={onMarkActive} bg={statusBg} w={24} px={spacing.micro}>
            <Stack h="full" alignItems={"center"} justifyContent="center">
              <Icon color="white" icon="fire"></Icon>
              <Text fontSize="xs" fontFamily={"mono"} color="white" fontWeight="semibold">
                Active
              </Text>
            </Stack>
          </Pressable>
        ) : (
          <Pressable onPress={onMarkComplete} bg={statusBg} w={24} px={spacing.micro}>
            <Stack h="full" alignItems={"center"} justifyContent="center">
              <Icon color="white" icon="checkCircle"></Icon>
              <Text fontSize="xs" fontFamily={"mono"} color="white" fontWeight="semibold">
                Complete
              </Text>
            </Stack>
          </Pressable>
        )}
      </HStack>
    </View>
  )
}

const ConversationListItem = ({
  conversation,
  onBlock,
  onViewContact,
  onMarkUnread,
  onMarkRead,
  onMarkComplete,
  onMarkActive,
}: IConversationListItem) => {
  const swipeableRef = React.useRef(null)

  const avatarColor = useAvatarColor(conversation.ContactName)
  const initials = useInitials(conversation.ContactName)

  const createdTime = useConversationCreatedTime(conversation)
  const conversationNumber = useConversationContactNumber(conversation)
  const conversationMessage = useConversationLastMessage(conversation)
  const isIncoming = useConversationIsIncoming(conversation)
  const isMessage = useConversationIsLastAMessage(conversation)
  const isCall = useConversationIsLastACall(conversation)

  const errorColor = useColorModeValue("error.300", "error.400")
  const cardBg = useColor("bg.main")

  const closeSwipeable = () => {
    Haptics.selectionAsync()
    swipeableRef.current.close()
  }

  const handleOnMarkRead = () => {
    closeSwipeable()
    onMarkRead()
  }

  const handleOnMarkUnread = () => {
    closeSwipeable()
    onMarkUnread()
  }
  const handleOnBlock = () => {
    closeSwipeable()
    onBlock()
  }

  const handleOnViewContact = () => {
    closeSwipeable()
    onViewContact()
  }

  const handleOnMarkActive = () => {
    closeSwipeable()
    onMarkActive()
  }
  const handleOnMarkComplete = () => {
    closeSwipeable()
    onMarkComplete()
  }

  console.log(conversation.ContactName)
  console.log(conversation.LatestMessage?.Message)

  return (
    <Swipeable
      ref={swipeableRef}
      renderLeftActions={() => (
        <LeftSwipeActions
          conversation={conversation}
          onMarkRead={handleOnMarkRead}
          onMarkUnread={handleOnMarkUnread}
        />
      )}
      renderRightActions={() => (
        <RightSwipeActions
          conversation={conversation}
          onBlock={handleOnBlock}
          onViewContact={handleOnViewContact}
          onMarkActive={handleOnMarkActive}
          onMarkComplete={handleOnMarkComplete}
        />
      )}
      overshootLeft={false}
      overshootRight={false}
    >
      <HStack bg={cardBg} py={spacing.tiny} px={spacing.tiny} space={4} alignItems="center">
        <AvatarRing
          outerRingColor={isIncoming ? errorColor : cardBg}
          innerRingColor={cardBg}
          avatarColor={avatarColor}
          initials={initials}
        ></AvatarRing>

        <Stack flex={1}>
          <HStack alignItems="center" justifyContent={"space-between"} space={spacing.micro}>
            <Text
              flex={1}
              numberOfLines={1}
              colorToken={"text"}
              fontWeight="semibold"
              text={conversation.ContactName || runFormatPhoneSimple(conversationNumber)}
            ></Text>
            {createdTime && (
              <Text textAlign={"right"} fontSize="xs" colorToken={"text.softer"}>
                {runFormatTimeFromNowSpecial(createdTime)}
              </Text>
            )}
          </HStack>
          <HStack alignItems="center" space={spacing.micro}>
            {isIncoming && isMessage ? (
              <Icon size={16} color={errorColor} icon="arrowDownLeft"></Icon>
            ) : null}
            {isIncoming && isCall ? (
              <Icon size={16} color={errorColor} icon="phoneArrowDownLeft"></Icon>
            ) : null}
            <Text
              flex={1}
              numberOfLines={1}
              maxH={12}
              fontSize="sm"
              colorToken={!conversation.IsRead ? "text" : "text.soft"}
              fontWeight={!conversation.IsRead ? "medium" : "normal"}
              text={isIncoming ? `${conversationMessage}` : `You: ${conversationMessage}`}
            ></Text>
            {!conversation.IsRead && <Dot.Error size="sm" />}
          </HStack>
        </Stack>

        <Box alignItems="center">
          <Icon colorToken={"text.softer"} icon="ellipsisVertical"></Icon>
        </Box>
      </HStack>
    </Swipeable>
  )
}

export const PureConversationListItem = React.memo(ConversationListItem)
