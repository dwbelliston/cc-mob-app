/*
ConversationCall
*/

import { Box, HStack, Stack, View } from "native-base"
import { ColorType } from "native-base/lib/typescript/components/types"
import React from "react"
import { Text } from "../../components"
import { ContactAvatar } from "../../components/ContactAvatar"
import { UserAvatar } from "../../components/UserAvatar"
import { CallDirectionEnum, ICall } from "../../models/Call"
import useReadUserProfile from "../../services/api/userprofile/queries/useReadUserProfile"
import { spacing } from "../../theme"
import { runFormatMinuteTime } from "../../utils/useFormatDate"
import CallBubble from "./CallBubble"

interface IProps {
  call: ICall
  contactName: string

  contactColor?: ColorType
  contactInitials?: string
}

const ConversationCall = ({ call, contactName, contactColor, contactInitials }: IProps) => {
  const [isUserCall, setIsUserCall] = React.useState(call.Direction === CallDirectionEnum.OUTBOUND)

  const { data: userProfile } = useReadUserProfile()

  React.useEffect(() => {
    setIsUserCall(call.Direction === CallDirectionEnum.OUTBOUND)
  }, [call])

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
          isMessageError={false}
          callIsForwarded={call.IsForwarded}
          callNumberForwardedTo={call.NumberForwardedTo}
          callIsOutsideHours={call.IsOutsideHours}
          callDurationTime={call.CallDurationTime}
          callRecordingUrl={call.RecordingUrl}
          callTranscriptionText={call.TranscriptionText}
        />
        {/* Meta */}
        <HStack
          color="gray.400"
          alignItems={"center"}
          direction={isUserCall ? "row" : "row-reverse"}
        >
          <HStack alignItems={"center"} space={spacing.micro}>
            <Text
              colorToken={"text.softer"}
              fontSize="xs"
              text={runFormatMinuteTime(call.CreatedTime)}
            ></Text>
          </HStack>

          {/* Gutter */}
          <Box ml={isUserCall ? 1 : 0} mr={!isUserCall ? 1 : 0}>
            {isUserCall ? (
              <UserAvatar isShowLoading={false} size="sm"></UserAvatar>
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
      </Stack>
    </View>
  )
}

export default ConversationCall
