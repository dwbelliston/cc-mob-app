import { useActionSheet } from "@expo/react-native-action-sheet"
import { BottomSheetFlatList, BottomSheetModal } from "@gorhom/bottom-sheet"
import * as Haptics from "expo-haptics"
import { Box, Divider, HStack, Pressable, Stack, useColorModeValue, View } from "native-base"

import { IBoxProps } from "native-base"
import React from "react"
import { useSharedValue } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Icon, Text } from "../../components"
import { AnimatedBackground } from "../../components/AnimatedBackground"
import { DataStatus } from "../../components/DataStatus"
import { UserAvatar } from "../../components/UserAvatar"
import { translate } from "../../i18n"
import { IScheduledMessage } from "../../models/ScheduledMessage"
import useDeleteScheduledMessage from "../../services/api/scheduledmessages/mutations/useDeleteScheduledMessage"
import useListNumberScheduledMessages from "../../services/api/scheduledmessages/queries/useListNumberScheduledMessages"
import { colors, spacing } from "../../theme"
import { useColor } from "../../theme/useColor"
import { pluralize } from "../../utils/pluralize"
import { useCustomToast } from "../../utils/useCustomToast"
import { runFormatTimeFromNow, runFormatTimeWithAt } from "../../utils/useFormatDate"

const TemplateOptionPressable = ({
  template,
  onDelete,
}: {
  template: IScheduledMessage
  onDelete: () => void
}) => {
  const progress = useSharedValue(0)

  const { showActionSheetWithOptions } = useActionSheet()

  const handleOnPress = () => {
    progress.value = 1

    const options = ["Delete", "Cancel"]
    const destructiveButtonIndex = 0
    const cancelButtonIndex = 1

    showActionSheetWithOptions(
      {
        title: template.Message,
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      (selectedIndex: number) => {
        switch (selectedIndex) {
          case 1:
            break

          case destructiveButtonIndex:
            onDelete()
            break

          case cancelButtonIndex:
          // Canceled
        }
      },
    )
  }

  return (
    <Pressable onPress={handleOnPress} px={spacing.tiny}>
      <Stack space={spacing.micro}>
        <HStack space={2}>
          <UserAvatar size="sm" mt={spacing.micro} isShowLoading={false}></UserAvatar>
          <Stack flex={1} space={2}>
            <AnimatedBackground
              sharedValue={progress}
              bgStart="bg.high"
              bgEnd={"bg.higher"}
              styles={{ borderRadius: 12 }}
            >
              <Stack flex={1} rounded="lg" py={spacing.tiny} px={spacing.tiny}>
                <Text flex={1} fontWeight={"normal"} fontSize="sm">
                  {template.Message}
                </Text>
              </Stack>
            </AnimatedBackground>
            <Stack>
              <Text fontSize="sm">{runFormatTimeWithAt(template.SendTime)}</Text>
              <Text colorToken={"text.softer"} fontSize="xs">
                {runFormatTimeFromNow(template.SendTime)}
              </Text>
            </Stack>
          </Stack>
        </HStack>
      </Stack>
    </Pressable>
  )
}

interface IProps extends IBoxProps {
  contactName: string
  contactNumber: string
}

export const NumberScheduledMessagesButton = ({ contactName, contactNumber, ...rest }: IProps) => {
  const bottomSheetModalRef = React.useRef<BottomSheetModal>(null)
  const [flatData, setFlatData] = React.useState<IScheduledMessage[]>()

  const snapPoints = React.useMemo(() => ["80%", "90%"], [])

  const progress = useSharedValue(0)
  const { top: topInset, bottom: bottomInset } = useSafeAreaInsets()
  const toast = useCustomToast()

  const bgMain = useColorModeValue(colors.primary[50], colors.primary[900])
  const bgEndColor = useColorModeValue(colors.primary[100], colors.primary[800])
  const borderColor = useColorModeValue("gray.300", "gray.700")
  const textColor = useColorModeValue("primary.700", "primary.200")
  const bgHighColor = useColor("bg.high")
  const bgColor = useColor("bg.main")
  const borderColorSheet = useColorModeValue(colors.gray[200], colors.gray[700])

  const { data: dataScheduled, isLoading: isLoadingScheduled } =
    useListNumberScheduledMessages(contactNumber)
  const { mutateAsync: mutateAsyncDelete, isLoading: isLoadingDelete } = useDeleteScheduledMessage()

  const handleOnCloseScheduleModal = () => {
    bottomSheetModalRef.current?.close()
  }

  const handleOnViewScheduledMessages = () => {
    progress.value = 1
    Haptics.selectionAsync()
    bottomSheetModalRef.current.present()
  }

  const handleOnDeleteConfirm = async (message: IScheduledMessage) => {
    if (message) {
      await mutateAsyncDelete(message.ScheduledMessageId)
      toast.success({ title: "Deleted" })
    }
    handleOnCloseScheduleModal()
  }

  const handleDeleteMessage = React.useCallback((message: IScheduledMessage) => {
    Haptics.selectionAsync()

    handleOnDeleteConfirm(message)

    bottomSheetModalRef.current?.close()
  }, [])

  const renderItem = React.useCallback(
    ({ item }: { item: IScheduledMessage }) => (
      <TemplateOptionPressable
        key={item.ScheduledMessageId}
        template={item}
        onDelete={() => {
          handleDeleteMessage(item)
        }}
      ></TemplateOptionPressable>
    ),
    [bgColor, borderColor, handleDeleteMessage],
  )

  React.useEffect(() => {
    if (dataScheduled) {
      const flatDataUpdate: IScheduledMessage[] = dataScheduled.records.flatMap(
        (template, idx) => template,
      )

      setFlatData(flatDataUpdate)
    }
  }, [dataScheduled])

  return (
    <>
      {dataScheduled?.records?.length && dataScheduled?.records?.length > 0 ? (
        <Pressable onPress={handleOnViewScheduledMessages}>
          <AnimatedBackground
            sharedValue={progress}
            // bgStart="bg.main"
            // bgEnd={"bg.higher"}
            bgStartColor={bgMain}
            bgEndColor={bgEndColor}
          >
            <Box borderTopWidth={1} borderColor={borderColor} py={2} px={6} {...rest}>
              <HStack space={4} justifyContent={"center"} alignItems={"center"}>
                <Icon color={textColor} size={16} icon="clock"></Icon>
                <Text color={textColor}>{`View ${pluralize(
                  dataScheduled.records.length,
                  "scheduled message",
                )}`}</Text>
              </HStack>
            </Box>
          </AnimatedBackground>
        </Pressable>
      ) : null}

      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={1}
        snapPoints={snapPoints}
        style={{
          borderTopWidth: 1,
          borderTopColor: borderColorSheet,
        }}
        handleStyle={{
          backgroundColor: bgHighColor,
        }}
        handleIndicatorStyle={{
          backgroundColor: borderColorSheet,
        }}
        android_keyboardInputMode="adjustResize"
      >
        <View
          style={{
            flex: 1,
            backgroundColor: bgColor,
          }}
        >
          <Box
            pb={spacing.tiny}
            px={spacing.tiny}
            borderBottomWidth={1}
            borderBottomColor={borderColorSheet}
            bg={bgHighColor}
          >
            <Text
              preset="heading"
              textAlign={"center"}
              fontSize="xl"
              tx="scheduledMessages.scheduled"
            ></Text>
          </Box>

          <BottomSheetFlatList
            data={flatData}
            style={{
              paddingTop: spacing.small,
            }}
            contentContainerStyle={{
              paddingBottom: bottomInset + spacing.large,
            }}
            ListEmptyComponent={
              isLoadingScheduled ? (
                <Box px={spacing.tiny} py={spacing.small} h="full">
                  <Text textAlign={"center"} colorToken="text.softer" tx="common.oneMoment"></Text>
                </Box>
              ) : (
                <Box px={spacing.tiny} py={spacing.small} h="full">
                  <DataStatus
                    title={translate("scheduledMessages.noMessages")}
                    icon={"clipboardDocumentCheck"}
                    colorScheme={"gray"}
                  />
                </Box>
              )
            }
            keyExtractor={(i) => i.ScheduledMessageId}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <Divider py={spacing.tiny} bg="transparent" />}
          />
        </View>
      </BottomSheetModal>
    </>
  )
}
