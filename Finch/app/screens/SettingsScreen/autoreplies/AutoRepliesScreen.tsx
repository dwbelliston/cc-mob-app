import { observer } from "mobx-react-lite"
import { Box, HStack, Spinner, Stack } from "native-base"
import React, { FC } from "react"

import { Button, Screen, Text } from "../../../components"
import { LabelValuePill } from "../../../components/LabelValuePill"
import { spacing } from "../../../theme"

import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { translate } from "../../../i18n"
import { useColor } from "../../../theme/useColor"
import { useCustomToast } from "../../../utils/useCustomToast"
import { SettingsStackScreenProps } from "../SettingsStack"

import { Butter } from "../../../components/Butter"
import { IAutoReplyForm } from "../../../models/CallFlow"
import useUpdateCallFlow from "../../../services/api/callflow/mutations/useUpdateCallFlow"
import useReadCallFlow from "../../../services/api/callflow/queries/useReadCallFlow"
import { EditAutoReplyForm, IAutoReplyWorkingForm } from "./EditAutoReplyForm"

enum EditFormModeEnum {
  HOURS_MESSAGE = "HOURS_MESSAGE",
  HOURS_CALL = "HOURS_CALL",
  AWAY_MESSAGE = "AWAY_MESSAGE",
  AWAY_CALL = "AWAY_CALL",
}

export type FormHandle = {
  submitForm: () => void
}

export const AutoRepliesScreen: FC<SettingsStackScreenProps<"BusinessHours">> = observer(
  function AutoRepliesScreen(_props) {
    const [editMode, setEditMode] = React.useState<EditFormModeEnum>()
    const [editMessage, setEditMessage] = React.useState<string>()
    const [editIsEnabled, setEditIsEnabled] = React.useState<boolean>()

    const bottomSheetModalRef = React.useRef<BottomSheetModal>(null)
    const formRef = React.useRef<FormHandle>(null)

    const snapPoints = React.useMemo(() => ["50%", "80%", "100%"], [])
    const { top: topInset, bottom: bottomInset } = useSafeAreaInsets()

    const toast = useCustomToast()

    const borderColor = useColor("text.softest")
    const bgHighColor = useColor("bg.high")
    const bgCard = useColor("bg.high")
    const bgColor = useColor("bg.main")

    const { data: dataCallFlow, isLoading: isLoadingMessage } = useReadCallFlow()
    const { mutateAsync: mutateAsyncUpdate, isLoading: isLoadingUpdate } = useUpdateCallFlow()

    const handleOnEdit = (
      mode: EditFormModeEnum,
      isEnabled: boolean | undefined,
      message: string | undefined,
    ) => {
      setEditIsEnabled(isEnabled)
      setEditMessage(message)
      setEditMode(mode)
      bottomSheetModalRef.current?.present()
    }

    const handleOnSubmit = async (data: IAutoReplyWorkingForm) => {
      const updateForm: IAutoReplyForm = {}

      // Edit during message
      if (EditFormModeEnum.HOURS_MESSAGE === editMode) {
        updateForm.IsEnableAutoIncomingMessage = data.IsEnabled
        updateForm.TextAutoIncomingMessage = data.Message
      }
      // Edit during call
      else if (EditFormModeEnum.HOURS_CALL === editMode) {
        updateForm.IsEnableAutoMissedCall = data.IsEnabled
        updateForm.TextAutoMissedCall = data.Message
      }
      // Edit away message
      else if (EditFormModeEnum.AWAY_MESSAGE === editMode) {
        updateForm.IsEnableAutoOutsideHoursIncomingMessage = data.IsEnabled
        updateForm.TextAutoOutsideHoursIncomingMessage = data.Message
      }
      // Edit away call
      else if (EditFormModeEnum.AWAY_CALL === editMode) {
        updateForm.IsEnableAutoOutsideHoursMissedCall = data.IsEnabled
        updateForm.TextAutoAutoOutsideHoursMissedCall = data.Message
      }

      try {
        await mutateAsyncUpdate(updateForm)

        toast.success({ title: translate("common.saved") })
        handleOnCancel()
      } catch (e) {
        toast.error({ title: "Error saving" })
      }
    }

    const handleOnCancel = () => {
      setEditIsEnabled(undefined)
      setEditMessage(undefined)
      setEditMode(undefined)
      bottomSheetModalRef.current?.dismiss()
    }

    const handleOnSave = () => {
      formRef.current.submitForm()
    }

    return (
      <Screen
        preset="scroll"
        contentContainerStyle={{
          paddingBottom: bottomInset + spacing.large,
        }}
        style={{}}
      >
        <Box py={spacing.extraSmall}>
          {isLoadingMessage ? (
            <Spinner></Spinner>
          ) : (
            <Stack space={spacing.extraSmall}>
              <Stack px={spacing.tiny}>
                <Text fontSize="lg" preset="subheading" tx="autoreplies.pageHeader"></Text>
                <Text colorToken="text.softer" fontSize="md" tx="autoreplies.pageSubheader"></Text>
              </Stack>

              <Stack space={spacing.small} px={spacing.tiny}>
                <Stack space={spacing.tiny}>
                  <Text fontSize="lg" tx="autoreplies.duringHours"></Text>

                  <Stack
                    space={spacing.tiny}
                    borderWidth={1}
                    borderColor={borderColor}
                    p={spacing.tiny}
                    rounded="lg"
                  >
                    <LabelValuePill.Boolean
                      label="autoreplies.autoToIncomingMessage"
                      icon="chatBubbleLeftEllipsis"
                      onEdit={() =>
                        handleOnEdit(
                          EditFormModeEnum.HOURS_MESSAGE,
                          dataCallFlow.IsEnableAutoIncomingMessage,
                          dataCallFlow.TextAutoIncomingMessage,
                        )
                      }
                      trueTx={"autoreplies.isOn"}
                      falseTx={"autoreplies.isOff"}
                      value={dataCallFlow && dataCallFlow?.IsEnableAutoIncomingMessage}
                    />
                    {dataCallFlow && dataCallFlow?.IsEnableAutoIncomingMessage ? (
                      <LabelValuePill.Text
                        label="autoreplies.onIncomingMessage"
                        icon="bolt"
                        onEdit={() =>
                          handleOnEdit(
                            EditFormModeEnum.HOURS_MESSAGE,
                            dataCallFlow.IsEnableAutoIncomingMessage,
                            dataCallFlow.TextAutoIncomingMessage,
                          )
                        }
                        text={dataCallFlow && dataCallFlow?.TextAutoIncomingMessage}
                      />
                    ) : null}
                  </Stack>

                  <Stack
                    space={spacing.tiny}
                    borderWidth={1}
                    borderColor={borderColor}
                    p={spacing.tiny}
                    rounded="lg"
                  >
                    <LabelValuePill.Boolean
                      label="autoreplies.autoToIncomingCall"
                      icon="phoneArrowDownLeft"
                      onEdit={() =>
                        handleOnEdit(
                          EditFormModeEnum.HOURS_CALL,
                          dataCallFlow.IsEnableAutoMissedCall,
                          dataCallFlow.TextAutoMissedCall,
                        )
                      }
                      trueTx={"autoreplies.isOn"}
                      falseTx={"autoreplies.isOff"}
                      value={dataCallFlow && dataCallFlow?.IsEnableAutoMissedCall}
                    />
                    {dataCallFlow && dataCallFlow?.IsEnableAutoMissedCall ? (
                      <LabelValuePill.Text
                        label="autoreplies.autoToIncomingCall"
                        icon="bolt"
                        onEdit={() =>
                          handleOnEdit(
                            EditFormModeEnum.HOURS_CALL,
                            dataCallFlow.IsEnableAutoMissedCall,
                            dataCallFlow.TextAutoMissedCall,
                          )
                        }
                        text={dataCallFlow && dataCallFlow?.TextAutoMissedCall}
                      />
                    ) : null}
                  </Stack>
                </Stack>
                <Stack space={spacing.tiny}>
                  <Text fontSize="lg" tx="autoreplies.outsideHours"></Text>

                  {!dataCallFlow?.IsEnableBusinessHours ? (
                    <Box>
                      <Butter.Warning
                        titleText={{ tx: "autoreplies.turnOnBusinessHours" }}
                        descriptionText={{
                          tx: "autoreplies.turnOnBusinessHoursMore",
                          fontSize: "xs",
                        }}
                      ></Butter.Warning>
                    </Box>
                  ) : null}

                  <Stack
                    space={spacing.tiny}
                    borderWidth={1}
                    borderColor={borderColor}
                    p={spacing.tiny}
                    rounded="lg"
                  >
                    <LabelValuePill.Boolean
                      label="autoreplies.autoToIncomingMessage"
                      icon="chatBubbleLeftEllipsis"
                      onEdit={() =>
                        handleOnEdit(
                          EditFormModeEnum.AWAY_MESSAGE,
                          dataCallFlow.IsEnableAutoOutsideHoursIncomingMessage,
                          dataCallFlow.TextAutoOutsideHoursIncomingMessage,
                        )
                      }
                      trueTx={"autoreplies.isOn"}
                      falseTx={"autoreplies.isOff"}
                      value={dataCallFlow && dataCallFlow?.IsEnableAutoOutsideHoursIncomingMessage}
                    />
                    {dataCallFlow && dataCallFlow?.IsEnableAutoOutsideHoursIncomingMessage ? (
                      <LabelValuePill.Text
                        label="autoreplies.onIncomingMessage"
                        icon="bolt"
                        onEdit={() =>
                          handleOnEdit(
                            EditFormModeEnum.AWAY_MESSAGE,
                            dataCallFlow.IsEnableAutoOutsideHoursIncomingMessage,
                            dataCallFlow.TextAutoOutsideHoursIncomingMessage,
                          )
                        }
                        text={dataCallFlow && dataCallFlow?.TextAutoOutsideHoursIncomingMessage}
                      />
                    ) : null}
                  </Stack>
                  <Stack
                    space={spacing.tiny}
                    borderWidth={1}
                    borderColor={borderColor}
                    p={spacing.tiny}
                    rounded="lg"
                  >
                    <LabelValuePill.Boolean
                      label="autoreplies.autoToIncomingCall"
                      icon="phoneArrowDownLeft"
                      onEdit={() =>
                        handleOnEdit(
                          EditFormModeEnum.AWAY_CALL,
                          dataCallFlow.IsEnableAutoOutsideHoursMissedCall,
                          dataCallFlow.TextAutoAutoOutsideHoursMissedCall,
                        )
                      }
                      trueTx={"autoreplies.isOn"}
                      falseTx={"autoreplies.isOff"}
                      value={dataCallFlow && dataCallFlow?.IsEnableAutoOutsideHoursMissedCall}
                    />
                    {dataCallFlow && dataCallFlow?.IsEnableAutoOutsideHoursMissedCall ? (
                      <LabelValuePill.Text
                        label="autoreplies.autoToIncomingCall"
                        icon="bolt"
                        onEdit={() =>
                          handleOnEdit(
                            EditFormModeEnum.AWAY_CALL,
                            dataCallFlow.IsEnableAutoOutsideHoursMissedCall,
                            dataCallFlow.TextAutoAutoOutsideHoursMissedCall,
                          )
                        }
                        text={dataCallFlow && dataCallFlow?.TextAutoAutoOutsideHoursMissedCall}
                      />
                    ) : null}
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
          )}
        </Box>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={0}
          snapPoints={snapPoints}
          topInset={topInset}
          style={{
            borderTopWidth: 1,
            borderTopColor: borderColor,
          }}
          handleStyle={{
            backgroundColor: bgHighColor,
          }}
          handleIndicatorStyle={{
            backgroundColor: borderColor,
          }}
        >
          <Box
            pb={spacing.tiny}
            px={spacing.tiny}
            borderBottomWidth={1}
            borderBottomColor={borderColor}
            bg={bgHighColor}
          >
            <HStack justifyContent={"space-between"}>
              <Box flex={1}>
                <Button onPress={handleOnCancel} size="xs" tx="common.cancel"></Button>
              </Box>

              <Text
                flex={3}
                preset="heading"
                textAlign={"center"}
                fontSize="xl"
                tx="common.edit"
              ></Text>

              <Box flex={1}>
                <Button
                  isLoading={isLoadingUpdate}
                  onPress={handleOnSave}
                  size="xs"
                  colorScheme={"primary"}
                  tx="common.save"
                ></Button>
              </Box>
            </HStack>
          </Box>
          <BottomSheetScrollView
            style={{
              flex: 1,
              backgroundColor: bgColor,
            }}
          >
            {editMode ? (
              <EditAutoReplyForm
                ref={formRef}
                data={{
                  IsEnabled: editIsEnabled,
                  Message: editMessage,
                }}
                onSubmit={handleOnSubmit}
              />
            ) : null}
          </BottomSheetScrollView>
        </BottomSheetModal>
      </Screen>
    )
  },
)
