// https://beta.reactjs.org/reference/react/memo#minimizing-props-changes

import * as Haptics from "expo-haptics"
import { Box, HStack, Pressable, Stack, useColorModeValue, View } from "native-base"
import React from "react"
import Swipeable from "react-native-gesture-handler/Swipeable"
import { Icon, Text } from "../../components"
import { AvatarRing } from "../../components/AvatarRing"
import {
  ConversationStatusEnum,
  getConversationContactNumber,
  getConversationCreatedTime,
  getConversationIsIncoming,
  getConversationIsLastACall,
  getConversationIsLastAMessage,
  getConversationLastMessage,
  IConversation,
} from "../../models/Conversation"
import { getAvatarColor, spacing } from "../../theme"
import { useColor } from "../../theme/useColor"
import { runFormatTimeFromNowSpecial } from "../../utils/useFormatDate"
import { runFormatPhoneSimple } from "../../utils/useFormatPhone"

import { useActionSheet } from "@expo/react-native-action-sheet"
import { Dot } from "../../components/Dot"
import { getInitials } from "../../utils/getInitials"

export interface IConversationListItemData {
  conversationId: string
  isRead: boolean
  isClosed: boolean
  contactName: string
  contactId: string
  conversationNumber: string
  avatarColor: string
  initials: string
  createdTime: string
  conversationMessage: string
  isIncoming: boolean
  isMessage: boolean
  isCall: boolean
}

export interface IConversationListItem extends IConversationListItemData {
  onMarkActive: (conversationId: string) => void
  onMarkComplete: (conversationId: string) => void
  onMarkUnread: (conversationId: string) => void
  onMarkRead: (conversationId: string) => void
  onBlock: (conversationNumber: string) => void
  onViewContact: (contactId: string) => void
  onViewConversation: ({
    contactName,
    conversationId,
  }: {
    contactName: string
    conversationId: string
  }) => void
}

interface ILeftActions {
  isRead: boolean
  onMarkUnread: () => void
  onMarkRead: () => void
}

interface IRightActions {
  contactName: string
  conversationNumber: string
  isClosed: boolean
  onBlock: () => void
  onViewContact: () => void
  onMarkActive: () => void
  onMarkComplete: () => void
}

export const makeConversationListItemData = (
  conversation: IConversation,
): IConversationListItemData => {
  const conversationId = conversation.ConversationId
  const avatarColor = getAvatarColor(conversation.ContactName)
  const initials = getInitials(conversation.ContactName)
  const createdTime = getConversationCreatedTime(conversation)
  const conversationNumber = getConversationContactNumber(conversation)
  const conversationMessage = getConversationLastMessage(conversation)
  const isIncoming = getConversationIsIncoming(conversation)
  const isMessage = getConversationIsLastAMessage(conversation)
  const isCall = getConversationIsLastACall(conversation)
  const isRead = conversation.IsRead
  const isClosed = conversation.Status === ConversationStatusEnum.CLOSED
  const contactName = conversation.ContactName
  const contactId = conversation.ContactId

  return {
    conversationId,
    contactId,
    isRead,
    isClosed,
    avatarColor,
    initials,
    createdTime,
    contactName,
    conversationNumber,
    conversationMessage,
    isIncoming,
    isMessage,
    isCall,
  }
}

const LeftSwipeActions = ({ isRead, onMarkRead, onMarkUnread }: ILeftActions) => {
  const unreadBg = useColorModeValue("error.200", "error.300")
  const unreadColor = useColorModeValue("error.900", "error.900")
  const readBg = useColorModeValue("success.100", "success.300")
  const readColor = useColorModeValue("success.900", "success.900")

  const statusBg = isRead ? unreadBg : readBg

  return (
    <View bg={statusBg}>
      {isRead ? (
        <Pressable onPress={onMarkUnread} w={24} px={spacing.tiny}>
          <Stack h="full" alignItems={"center"} justifyContent="center">
            <Icon color={unreadColor} icon="bellAlert"></Icon>
            <Text fontSize="xs" fontFamily={"mono"} color={unreadColor} fontWeight="semibold">
              Unread
            </Text>
          </Stack>
        </Pressable>
      ) : (
        <Pressable onPress={onMarkRead} w={24} px={spacing.tiny}>
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
  contactName,
  conversationNumber,
  isClosed,
  onViewContact,
  onBlock,
  onMarkActive,
  onMarkComplete,
}: IRightActions) => {
  const moreBg = useColorModeValue("gray.100", "gray.800")
  const activeBg = useColorModeValue("primary.600", "primary.800")
  const completeBg = useColorModeValue("success.600", "success.800")

  const { showActionSheetWithOptions } = useActionSheet()

  const title = contactName || runFormatPhoneSimple(conversationNumber)

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
          <Pressable onPress={onMarkActive} bg={activeBg} w={24} px={spacing.micro}>
            <Stack h="full" alignItems={"center"} justifyContent="center">
              <Icon color="white" icon="fire"></Icon>
              <Text fontSize="xs" fontFamily={"mono"} color="white" fontWeight="semibold">
                Active
              </Text>
            </Stack>
          </Pressable>
        ) : (
          <Pressable onPress={onMarkComplete} bg={completeBg} w={24} px={spacing.micro}>
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
  conversationId,
  isRead,
  isClosed,
  avatarColor,
  initials,
  createdTime,
  contactName,
  contactId,
  conversationNumber,
  conversationMessage,
  isIncoming,
  isMessage,
  isCall,
  onViewConversation,
  onBlock,
  onViewContact,
  onMarkUnread,
  onMarkRead,
  onMarkComplete,
  onMarkActive,
}: IConversationListItem) => {
  const swipeableRef = React.useRef(null)

  const errorColor = useColorModeValue("error.300", "error.400")
  const cardBg = useColor("bg.main")

  const closeSwipeable = () => {
    Haptics.selectionAsync()
    swipeableRef.current.close()
  }

  const handleOnMarkRead = () => {
    closeSwipeable()
    onMarkRead(conversationId)
  }

  const handleOnMarkUnread = () => {
    closeSwipeable()
    onMarkUnread(conversationId)
  }
  const handleOnBlock = () => {
    closeSwipeable()
    onBlock(conversationNumber)
  }

  const handleOnViewContact = () => {
    closeSwipeable()
    onViewContact(contactId)
  }

  const handleOnMarkActive = () => {
    closeSwipeable()
    onMarkActive(conversationId)
  }
  const handleOnMarkComplete = () => {
    closeSwipeable()
    onMarkComplete(conversationId)
  }

  const handleOnClickConversation = () => {
    closeSwipeable()
    onViewConversation({ contactName, conversationId })
  }

  return (
    <Swipeable
      ref={swipeableRef}
      renderLeftActions={() => (
        <LeftSwipeActions
          isRead={isRead}
          onMarkRead={handleOnMarkRead}
          onMarkUnread={handleOnMarkUnread}
        />
      )}
      renderRightActions={() => (
        <RightSwipeActions
          contactName={contactName}
          conversationNumber={conversationNumber}
          isClosed={isClosed}
          onBlock={handleOnBlock}
          onViewContact={handleOnViewContact}
          onMarkActive={handleOnMarkActive}
          onMarkComplete={handleOnMarkComplete}
        />
      )}
      overshootLeft={false}
      overshootRight={false}
    >
      <Pressable onPress={handleOnClickConversation}>
        <HStack bg={cardBg} py={spacing.tiny} px={spacing.tiny} space={4} alignItems="center">
          <AvatarRing
            outerRingColor={cardBg}
            // outerRingColor={isIncoming ? errorColor : cardBg}
            innerRingColor={cardBg}
            avatarColor={avatarColor}
            initials={initials}
            avatarProps={{ size: "md" }}
          ></AvatarRing>

          <Stack flex={1}>
            <HStack alignItems="center" justifyContent={"space-between"} space={spacing.micro}>
              <Text
                flex={1}
                numberOfLines={1}
                colorToken={"text"}
                fontWeight="semibold"
                fontSize="md"
                text={contactName || runFormatPhoneSimple(conversationNumber)}
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
                colorToken={!isRead ? "text" : "text.soft"}
                fontWeight={!isRead ? "medium" : "normal"}
                text={isIncoming ? `${conversationMessage}` : `You: ${conversationMessage}`}
              ></Text>
              {!isRead && <Dot.Error size="sm" />}
              {isRead && isClosed && <Dot.Neutral size="sm" />}
            </HStack>
          </Stack>

          <Box alignItems="center">
            <Icon colorToken={"text.softer"} icon="ellipsisVertical"></Icon>
          </Box>
        </HStack>
      </Pressable>
    </Swipeable>
  )
}

export const PureConversationListItem = React.memo(ConversationListItem)
