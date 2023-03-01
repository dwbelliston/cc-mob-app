// https://beta.reactjs.org/reference/react/memo#minimizing-props-changes

import { HStack, useColorModeValue } from "native-base"
import React from "react"
import { IConversationItem } from "../../models/Conversation"
import { spacing } from "../../theme"
import { useColor } from "../../theme/useColor"

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

// export const makeConversationStreamItemData = (
//   conversation: IConversation,
// ): IConversationStreamItemData => {
//   const conversationId = conversation.ConversationId
//   const avatarColor = getAvatarColor(conversation.ContactName)
//   const initials = getInitials(conversation.ContactName)
//   const createdTime = getConversationCreatedTime(conversation)
//   const conversationNumber = getConversationContactNumber(conversation)
//   const conversationMessage = getConversationLastMessage(conversation)
//   const isIncoming = getConversationIsIncoming(conversation)
//   const isMessage = getConversationIsLastAMessage(conversation)
//   const isCall = getConversationIsLastACall(conversation)
//   const isRead = conversation.IsRead
//   const isClosed = conversation.Status === ConversationStatusEnum.CLOSED
//   const contactName = conversation.ContactName
//   const contactId = conversation.ContactId

//   return {
//     conversationId,
//     contactId,
//     isRead,
//     isClosed,
//     avatarColor,
//     initials,
//     createdTime,
//     contactName,
//     conversationNumber,
//     conversationMessage,
//     isIncoming,
//     isMessage,
//     isCall,
//   }
// }

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
    <HStack py={spacing.tiny} px={spacing.tiny} space={4} alignItems="center">
      <React.Fragment>
        {conversationItem.message && (
          <ConversationMessage
            key={conversationItem.message.MessageId}
            contactName={contactName}
            message={conversationItem.message}
          ></ConversationMessage>
        )}
        {conversationItem.call && (
          <ConversationCall
            contactName={contactName}
            key={conversationItem.call.CallId}
            call={conversationItem.call}
          ></ConversationCall>
        )}
      </React.Fragment>
    </HStack>
  )
}

export const PureConversationStreamItem = React.memo(ConversationStreamItem)
