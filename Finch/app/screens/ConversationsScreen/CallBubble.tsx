/*
CallBubble
*/

import { Box, HStack, IBoxProps, ITextProps, Stack, useColorModeValue } from "native-base"
import React from "react"
import { Text } from "../../components"
import { AudioRecording } from "../../components/AudioRecording"
import { CallDuration } from "../../components/CallDuration"
import CallStatus from "../../components/CallStatus"
import { CallDirectionEnum, CallStatusEnum, ICall } from "../../models/Call"
import { colors, spacing } from "../../theme"

interface IProps extends IBoxProps {
  isUserCall?: boolean
  isMessageError?: boolean
  textProps?: ITextProps
  // set
  callIsForwarded: ICall["IsForwarded"]
  callNumberForwardedTo: ICall["NumberForwardedTo"]
  callIsOutsideHours: ICall["IsOutsideHours"]
  callDurationTime: ICall["CallDurationTime"]
  callRecordingUrl: ICall["RecordingUrl"]
  callTranscriptionText: ICall["TranscriptionText"]
}

const CallBubble = (props: IProps) => {
  const {
    textProps,
    isUserCall = false,
    isMessageError = false,
    callIsForwarded,
    callDurationTime,
    callNumberForwardedTo,
    callIsOutsideHours,
    callTranscriptionText,
    callRecordingUrl,
    ...rest
  } = props

  const callStatus = CallStatusEnum.COMPLETED
  const callDirection = CallDirectionEnum.INBOUND

  const bgError = useColorModeValue(colors.error[100], colors.error[900])
  const borderError = useColorModeValue(colors.error[300], colors.error[600])
  const colorError = useColorModeValue(colors.gray[800], colors.error[200])

  const bgRight = useColorModeValue(colors.blue[50], colors.blue[800])
  const borderRight = useColorModeValue(colors.blue[200], colors.blue[600])
  const colorRight = useColorModeValue(colors.gray[800], colors.white)

  const bgLeft = useColorModeValue(colors.white, colors.gray[800])
  const borderLeft = useColorModeValue(colors.gray[200], colors.gray[700])
  const colorLeft = useColorModeValue(colors.gray[800], colors.white)

  return (
    <Box
      w="full"
      p={2}
      rounded="xl"
      roundedBottomLeft={isUserCall ? "xl" : "2"}
      roundedBottomRight={isUserCall ? "2" : "xl"}
      // shadow={0}
      py={3}
      px={4}
      bg={isMessageError ? bgError : isUserCall ? bgRight : bgLeft}
      borderColor={isMessageError ? borderError : isUserCall ? borderRight : borderLeft}
      borderWidth={1}
      {...rest}
    >
      <Stack space={spacing.micro}>
        <HStack space={spacing.tiny} alignItems="center">
          <Box>
            <CallStatus.Icon status={callStatus} direction={callDirection}></CallStatus.Icon>
          </Box>

          <Stack space={0} flex={1}>
            <HStack justifyContent={"space-between"} alignItems="center">
              <CallStatus.Description fontSize="md" status={callStatus}></CallStatus.Description>
              <CallStatus.Forwarded
                colorToken={"text.soft"}
                fontSize="sm"
                callIsForwarded={callIsForwarded}
                callNumberForwardedTo={callNumberForwardedTo}
              ></CallStatus.Forwarded>
              <CallStatus.OutideHours
                colorToken={"text.soft"}
                fontSize="sm"
                callIsOutsideHours={callIsOutsideHours}
              ></CallStatus.OutideHours>
            </HStack>

            {callDurationTime && callDurationTime !== "0" && (
              <CallDuration
                fontSize="xs"
                colorToken={"text.soft"}
                duration={callDurationTime + 100}
              ></CallDuration>
            )}
          </Stack>
        </HStack>

        {callTranscriptionText && (
          <Stack space={1}>
            <Text colorToken="text.soft" preset="label" tx={"inbox.transcript"}></Text>
            <Text fontFamily={"plain"} text={callTranscriptionText}></Text>
          </Stack>
        )}

        {callRecordingUrl && (
          <Stack space={1}>
            <Text colorToken="text.soft" preset="label" tx={"inbox.recording"}></Text>
            <AudioRecording recordingUrl={callRecordingUrl} />
          </Stack>
        )}
      </Stack>
    </Box>
  )
}

export default CallBubble
