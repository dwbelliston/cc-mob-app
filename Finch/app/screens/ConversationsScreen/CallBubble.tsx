/*
CallBubble
*/

import { useActionSheet } from "@expo/react-native-action-sheet"
import * as Clipboard from "expo-clipboard"
import * as Haptics from "expo-haptics"
import { Box, HStack, IBoxProps, Stack, useColorModeValue } from "native-base"
import React from "react"
import { Text } from "../../components"
import { AudioRecording } from "../../components/AudioRecording"
import CallDirection from "../../components/CallDirection"
import { CallDuration } from "../../components/CallDuration"
import CallStatus from "../../components/CallStatus"
import { translate } from "../../i18n"
import { ICall } from "../../models/Call"
import { colors, spacing } from "../../theme"

interface IProps extends IBoxProps {
  isUserCall: boolean
  callStatus: ICall["Status"]
  callDirection: ICall["Direction"]
  callIsForwarded?: ICall["IsForwarded"]
  callNumberForwardedTo?: ICall["NumberForwardedTo"]
  callIsOutsideHours?: ICall["IsOutsideHours"]
  callDurationTime?: ICall["CallDurationTime"]
  callRecordingUrl?: ICall["RecordingUrl"]
  callTranscriptionText?: ICall["TranscriptionText"]
  callNote?: ICall["Note"]
}

const CallBubble = (props: IProps) => {
  const {
    isUserCall,
    callStatus,
    callDirection,
    callIsForwarded = false,
    callDurationTime,
    callNumberForwardedTo,
    callIsOutsideHours,
    callTranscriptionText,
    callNote,
    callRecordingUrl,
    ...rest
  } = props

  const bgError = useColorModeValue(colors.error[100], colors.error[900])
  const borderError = useColorModeValue(colors.error[300], colors.error[600])

  const bgRight = useColorModeValue(colors.blue[50], colors.blue[800])
  const borderRight = useColorModeValue(colors.blue[200], colors.blue[600])

  const bgLeft = useColorModeValue(colors.white, colors.gray[800])
  const borderLeft = useColorModeValue(colors.gray[200], colors.gray[700])

  const { showActionSheetWithOptions } = useActionSheet()

  const onCopyText = async () => {
    await Clipboard.setStringAsync(callTranscriptionText)
    Haptics.notificationAsync()
  }

  const onCopyNote = async () => {
    await Clipboard.setStringAsync(callNote)
    Haptics.notificationAsync()
  }

  // const handleOnLongPress = () => {
  //   console.log("handleOnLongPress")
  //   toast.success({ title: "test" })
  // }

  const handleOnLongPressNote = () => {
    Haptics.selectionAsync()

    const options = ["Copy Note", "Cancel"]
    const destructiveButtonIndex = 0
    const cancelButtonIndex = 1

    showActionSheetWithOptions(
      {
        title: translate("stream.options"),
        options,
        cancelButtonIndex,
        // destructiveButtonIndex,
      },
      (selectedIndex: number) => {
        switch (selectedIndex) {
          case 0:
            // View Contact
            onCopyText()
            break
          case 1:
            // View Contact
            onCopyNote()
            break

          case cancelButtonIndex:
          // Canceled
        }
      },
    )
  }
  const handleOnLongPressTranscript = () => {
    const options = ["Copy Transcript", "Cancel"]
    const destructiveButtonIndex = 0
    const cancelButtonIndex = 1

    showActionSheetWithOptions(
      {
        title: translate("stream.options"),
        options,
        cancelButtonIndex,
        // destructiveButtonIndex,
      },
      (selectedIndex: number) => {
        switch (selectedIndex) {
          case 0:
            // View Contact
            onCopyText()
            break

          case cancelButtonIndex:
          // Canceled
        }
      },
    )
  }

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
      bg={isUserCall ? bgRight : bgLeft}
      borderColor={isUserCall ? borderRight : borderLeft}
      borderWidth={1}
      {...rest}
    >
      <Stack space={spacing.tiny}>
        <HStack space={spacing.tiny} alignItems="center">
          <Box>
            <CallStatus.Icon status={callStatus} direction={callDirection}></CallStatus.Icon>
          </Box>

          <Stack space={0} flex={1}>
            <CallStatus.Description fontSize="md" status={callStatus}></CallStatus.Description>

            <CallStatus.Forwarded
              colorToken={"text.soft"}
              fontSize="xs"
              callIsForwarded={callIsForwarded}
              callNumberForwardedTo={callNumberForwardedTo}
            ></CallStatus.Forwarded>
            <CallStatus.OutideHours
              colorToken={"text.soft"}
              fontSize="xs"
              callIsOutsideHours={callIsOutsideHours}
            ></CallStatus.OutideHours>
            <CallDirection.Description
              fontSize="xs"
              colorToken={"text.soft"}
              status={callDirection}
            ></CallDirection.Description>
            {callDurationTime && callDurationTime !== "0" && (
              <CallDuration
                fontSize="xs"
                colorToken={"text.soft"}
                duration={callDurationTime}
              ></CallDuration>
            )}
          </Stack>
        </HStack>

        {callTranscriptionText && (
          <Stack space={1}>
            <Text colorToken="text.soft" preset="label" tx={"inbox.transcript"}></Text>
            <Text
              fontFamily={"plain"}
              // selectable={true}
              onLongPress={handleOnLongPressTranscript}
              suppressHighlighting={true}
              text={callTranscriptionText}
            ></Text>
          </Stack>
        )}

        {callRecordingUrl && (
          <Stack space={1}>
            <Text colorToken="text.soft" preset="label" tx={"inbox.recording"}></Text>
            <AudioRecording recordingUrl={callRecordingUrl} />
          </Stack>
        )}

        {callNote && (
          <Stack space={1}>
            <Text colorToken="text.soft" preset="label" tx={"inbox.notes"}></Text>
            <Text
              fontFamily={"plain"}
              // selectable={true}
              onLongPress={handleOnLongPressNote}
              suppressHighlighting={true}
              text={callNote}
            ></Text>
          </Stack>
        )}
      </Stack>
    </Box>
  )
}

export default CallBubble
