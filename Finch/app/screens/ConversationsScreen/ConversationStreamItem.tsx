// https://beta.reactjs.org/reference/react/memo#minimizing-props-changes

import { useColorModeValue, View } from "native-base"
import React from "react"
import { IConversationItem } from "../../models/Conversation"
import {
  getIsAutoReply,
  getIsCompliance,
  getIsMessageBlocked,
  getIsMessageError,
  getIsMessageSending,
  getIsUserMessage,
  getMessageBroadcastId,
  getMessageDispatchId,
  getMessageStatusDisplay,
  IMessage,
} from "../../models/Message"
import { getAvatarColor, spacing } from "../../theme"
import { useColor } from "../../theme/useColor"
import { getInitials } from "../../utils/getInitials"

import ConversationCall from "./ConversationCall"
import ConversationMessage from "./ConversationMessage"

export interface IConversationStreamItemData {
  conversationItem: IConversationItem
  //   conversationId: string
  //   isRead: boolean
  //   isClosed: boolean
  //   contactName: string
  //   contactId: string
  //   conversationNumber: string
  //   avatarColor: string
  //   initials: string
  //   createdTime: string
  //   conversationMessage: string
  //   isIncoming: boolean
  //   isMessage: boolean
  //   isCall: boolean
}

export interface IConversationStreamItem extends IConversationStreamItemData {
  //   onMarkActive: (conversationId: string) => void
  //   onMarkComplete: (conversationId: string) => void
  //   onMarkUnread: (conversationId: string) => void
  //   onMarkRead: (conversationId: string) => void
  //   onBlock: (conversationNumber: string) => void
  //   onViewContact: (contactName: string, contactColor: string, contactId: string) => void
  //   onViewConversation: ({
  //     contactName,
  //     conversationId,
  //   }: {
  //     contactName: string
  //     conversationId: string
  //   }) => void
}

export const makeConversationStreamItemMessage = (
  message: IMessage,
  contactName: string,
): IConversationItem["message"] => {
  return {
    mediaItems: message.MessageMediaItems,
    message: message.Message,
    createdTime: message.CreatedTime,
    isMessageError: getIsMessageError(message),
    isMessageBlocked: getIsMessageBlocked(message),
    isMessageSending: getIsMessageSending(message),
    isAutoReply: getIsAutoReply(message),
    isCompliance: getIsCompliance(message),
    isUserMessage: getIsUserMessage(message),
    contactInitials: getInitials(contactName),
    contactColor: getAvatarColor(contactName),
    messageBroadcastId: getMessageBroadcastId(message),
    messageCampaignId: getMessageDispatchId(message),
    messageStatus: getMessageStatusDisplay(message.Status),
  }
}

const ConversationStreamItem = ({
  conversationItem,
}: //   isRead,
//   isClosed,
//   avatarColor,
//   initials,
//   createdTime,
//   contactName,
//   contactId,
//   conversationNumber,
//   conversationMessage,
//   isIncoming,
//   isMessage,
//   isCall,
//   onViewConversation,
//   onBlock,
//   onViewContact,
//   onMarkUnread,
//   onMarkRead,
//   onMarkComplete,
//   onMarkActive,
IConversationStreamItem) => {
  const swipeableRef = React.useRef(null)

  const errorColor = useColorModeValue("error.300", "error.400")
  const cardBg = useColor("bg.main")

  //   const handleOnMarkRead = () => {
  //     onMarkRead(conversationId)
  //   }

  //   const handleOnMarkUnread = () => {
  //     onMarkUnread(conversationId)
  //   }
  //   const handleOnBlock = () => {
  //     onBlock(conversationNumber)
  //   }

  //   const handleOnViewContact = () => {
  //     onViewContact(contactId, contactName, avatarColor)
  //   }

  //   const handleOnMarkActive = () => {
  //     onMarkActive(conversationId)
  //   }
  //   const handleOnMarkComplete = () => {
  //     onMarkComplete(conversationId)
  //   }

  //   const handleOnClickConversation = () => {
  //     onViewConversation({ contactName, conversationId })
  //   }

  const contactName = "dustin belliston"

  return (
    <View py={spacing.tiny}>
      <React.Fragment>
        {conversationItem.message && (
          <ConversationMessage {...conversationItem.message}></ConversationMessage>
        )}
        {conversationItem.call && (
          <ConversationCall
            contactName={contactName}
            key={conversationItem.call.CallId}
            call={conversationItem.call}
          ></ConversationCall>
        )}
      </React.Fragment>
    </View>
  )
}

export const PureConversationStreamItem = React.memo(ConversationStreamItem)
