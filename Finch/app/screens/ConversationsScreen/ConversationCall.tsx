/*
ConversationCall
*/

import { Box, HStack, Stack, View } from "native-base"
import { ColorType } from "native-base/lib/typescript/components/types"
import React from "react"
import { Text } from "../../components"
import { ICall } from "../../models/Call"
import { spacing } from "../../theme"
import { runFormatMinuteTime } from "../../utils/useFormatDate"
import CallBubble from "./CallBubble"
import { SenderAvatar } from "./SenderAvatar"

export interface IConversationCallProps {
  callCreatedTime: ICall["CreatedTime"]
  contactColor?: ColorType
  callStatus: ICall["Status"]
  callDirection: ICall["Direction"]
  contactInitials?: string
  isUserCall?: boolean
  callIsForwarded?: ICall["IsForwarded"]
  callNumberForwardedTo?: ICall["NumberForwardedTo"]
  callIsOutsideHours?: ICall["IsOutsideHours"]
  callDurationTime?: ICall["CallDurationTime"]
  callRecordingUrl?: ICall["RecordingUrl"]
  callTranscriptionText?: ICall["TranscriptionText"]
  callNote?: ICall["Note"]
  contactId?: string
  callerMemberId?: string
  callerName?: string
}

const ConversationCall = ({
  callCreatedTime,
  contactColor,
  contactInitials,
  callStatus,
  callDirection,
  isUserCall,
  callIsForwarded,
  callNumberForwardedTo,
  callIsOutsideHours,
  callDurationTime,
  callRecordingUrl,
  callTranscriptionText,
  callNote,
  contactId,
  callerMemberId,
  callerName,
}: IConversationCallProps) => {
  return (
    <View
      w="full"
      // Put some contraint on it
      pl={isUserCall ? spacing.extraSmall : 0}
      pr={!isUserCall ? spacing.extraSmall : 0}
    >
      {/* Container */}
      <Stack flex={1} space={1} alignItems={isUserCall ? "flex-end" : "flex-start"}>
        <CallBubble
          isUserCall={isUserCall}
          callStatus={callStatus}
          callDirection={callDirection}
          callIsForwarded={callIsForwarded}
          callNumberForwardedTo={callNumberForwardedTo}
          callIsOutsideHours={callIsOutsideHours}
          callDurationTime={callDurationTime}
          callRecordingUrl={callRecordingUrl}
          callTranscriptionText={callTranscriptionText}
          callNote={callNote}
        />
        {/* Meta */}
        <HStack
          alignItems={"center"}
          direction={isUserCall ? "row" : "row-reverse"}
          space={spacing.micro}
        >
          <HStack alignItems={"center"} space={spacing.micro}>
            {isUserCall ? (
              <Text
                fontSize="sm"
                fontWeight={"normal"}
                colorToken={"text.softer"}
                text={callerName}
              ></Text>
            ) : null}

            <Text
              colorToken={"text.softer"}
              fontSize="sm"
              text={runFormatMinuteTime(callCreatedTime)}
            ></Text>
          </HStack>

          <Box ml={isUserCall ? 1 : 0} mr={!isUserCall ? 1 : 0}>
            <SenderAvatar
              isUserMessage={isUserCall}
              senderMemberId={callerMemberId}
              senderName={callerName}
              contactId={contactId}
              contactInitials={contactInitials}
            ></SenderAvatar>
          </Box>
        </HStack>
      </Stack>
    </View>
  )
}

export default ConversationCall
