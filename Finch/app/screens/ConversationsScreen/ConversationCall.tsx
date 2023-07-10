/*
ConversationCall
*/

import { Box, HStack, Stack, View } from "native-base"
import { ColorType } from "native-base/lib/typescript/components/types"
import React from "react"
import { Text } from "../../components"
import { ContactAvatar } from "../../components/ContactAvatar"
import { UserAvatar } from "../../components/UserAvatar"
import { ICall } from "../../models/Call"
import { spacing } from "../../theme"
import { runFormatMinuteTime } from "../../utils/useFormatDate"
import CallBubble from "./CallBubble"

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
  contactId?: string
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
  contactId,
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
        />
        {/* Meta */}
        <HStack alignItems={"center"} direction={isUserCall ? "row" : "row-reverse"}>
          <HStack alignItems={"center"} space={spacing.micro}>
            <Text
              colorToken={"text.softer"}
              fontSize="xs"
              text={runFormatMinuteTime(callCreatedTime)}
            ></Text>
          </HStack>

          <Box ml={isUserCall ? 1 : 0} mr={!isUserCall ? 1 : 0}>
            {isUserCall ? (
              <UserAvatar size="sm"></UserAvatar>
            ) : (
              <ContactAvatar
                // avatarColor={contactColor}
                contactId={contactId}
                initials={contactInitials}
                avatarProps={{ size: "sm" }}
              ></ContactAvatar>
            )}
          </Box>
        </HStack>
      </Stack>
    </View>
  )
}

export default ConversationCall
