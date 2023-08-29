// https://beta.reactjs.org/reference/react/memo#minimizing-props-changes

import { View } from "native-base"
import React from "react"
import { getCallContactId, getIsUserCall, ICall } from "../../models/Call"
import { IConversationItem } from "../../models/Conversation"
import {
  getContactId,
  getIsAutoReply,
  getIsCompliance,
  getIsMessageBlocked,
  getIsMessageError,
  getIsMessageSending,
  getIsUserMessage,
  getMessageBroadcastId,
  getMessageDispatchId,
  getMessageStatusDisplay,
  getMessageVideoDetails,
  IMessage,
} from "../../models/Message"
import { getAvatarColor, spacing } from "../../theme"
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
    contactId: getContactId(message),
    contactColor: getAvatarColor(contactName),
    messageBroadcastId: getMessageBroadcastId(message),
    messageCampaignId: getMessageDispatchId(message),
    videoDetails: getMessageVideoDetails(message),
    messageStatus: getMessageStatusDisplay(message.Status),
  }
}
export const makeConversationStreamItemCall = (
  call: ICall,
  contactName: string,
): IConversationItem["call"] => {
  return {
    callCreatedTime: call.CreatedTime,
    callStatus: call.Status,
    callDirection: call.Direction,
    contactColor: getAvatarColor(contactName),
    contactInitials: getInitials(contactName),
    isUserCall: getIsUserCall(call),
    contactId: getCallContactId(call),
    callIsForwarded: call.IsForwarded,
    callNumberForwardedTo: call.NumberForwardedTo,
    callIsOutsideHours: call.IsOutsideHours,
    callDurationTime: call.CallDurationTime,
    callRecordingUrl: call.RecordingUrl,
    callTranscriptionText: call.TranscriptionText,
    callNote: call.Note,
  }
}

const ConversationStreamItem = ({ conversationItem }: IConversationStreamItem) => {
  return (
    <View py={spacing.tiny} px={spacing.tiny}>
      <React.Fragment>
        {conversationItem.message && (
          <ConversationMessage {...conversationItem.message}></ConversationMessage>
        )}
        {conversationItem.call && <ConversationCall {...conversationItem.call}></ConversationCall>}
      </React.Fragment>
    </View>
  )
}

export const PureConversationStreamItem = React.memo(ConversationStreamItem)
