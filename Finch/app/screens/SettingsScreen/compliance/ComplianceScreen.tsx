import * as WebBrowser from "expo-web-browser"
import { observer } from "mobx-react-lite"
import { Box, HStack, Spinner, Stack } from "native-base"
import React, { FC } from "react"
import { gestureHandlerRootHOC } from "react-native-gesture-handler"

import { Button, Screen, Text } from "../../../components"
import { LabelValuePill } from "../../../components/LabelValuePill"
import { spacing } from "../../../theme"

import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { PressableActionRow } from "../../../components/PressableActionRow"
import { translate } from "../../../i18n"
import {
  IComplianceMessageEnabledUpdate,
  IComplianceMessageMessageUpdate,
} from "../../../models/ComplianceMessage"
import useUpdateComplianceMessage from "../../../services/api/compliancemessage/mutations/useUpdateComplianceMessage"
import useReadComplianceMessage from "../../../services/api/compliancemessage/queries/useReadComplianceMessage"
import useReadUserProfile from "../../../services/api/userprofile/queries/useReadUserProfile"
import { useColor } from "../../../theme/useColor"
import { useCustomToast } from "../../../utils/useCustomToast"
import { SettingsStackScreenProps } from "../SettingsStack"
import { EditComplianceEnabledForm } from "./EditComplianceEnabledForm"
import { EditComplianceMessageForm } from "./EditComplianceMessageForm"

enum EditFormModeEnum {
  ISENABLED = "ISENABLED",
  MESSAGE = "MESSAGE",
}

export type FormHandle = {
  submitForm: () => void
}

const ComplianceScreenBase: FC<SettingsStackScreenProps<"Compliance">> = observer(
  function ComplianceScreen(_props) {
    const [editMode, setEditMode] = React.useState<EditFormModeEnum>()
    const bottomSheetModalRef = React.useRef<BottomSheetModal>(null)
    const formRef = React.useRef<FormHandle>(null)

    const snapPoints = React.useMemo(() => ["50%", "80%", "100%"], [])
    const { top: topInset, bottom: bottomInset } = useSafeAreaInsets()

    const toast = useCustomToast()

    const borderColor = useColor("text.softest")
    const bgHighColor = useColor("bg.high")
    const bgCard = useColor("bg.high")
    const bgColor = useColor("bg.main")

    const { data: userProfile } = useReadUserProfile()
    const { data: dataComplianceMessage, isLoading: isLoadingMessage } = useReadComplianceMessage()
    const { mutateAsync: mutateAsyncUpdate, isLoading: isLoadingUpdate } =
      useUpdateComplianceMessage()

    const onViewTCPA = () => {
      WebBrowser.openBrowserAsync("https://www.fcc.gov/sites/default/files/tcpa-rules.pdf")
    }

    const handleOnEdit = () => {
      setEditMode(EditFormModeEnum.ISENABLED)
      bottomSheetModalRef.current?.present()
    }

    const handleOnEditMessage = () => {
      setEditMode(EditFormModeEnum.MESSAGE)
      bottomSheetModalRef.current?.present()
    }

    const handleOnSubmitEnabled = async (data: IComplianceMessageEnabledUpdate) => {
      try {
        await mutateAsyncUpdate(data)

        toast.success({ title: translate("common.saved") })
        handleOnCancel()
      } catch (e) {
        toast.error({ title: "Error saving" })
      }
    }
    const handleOnSubmitMessage = async (data: IComplianceMessageMessageUpdate) => {
      try {
        await mutateAsyncUpdate(data)

        toast.success({ title: translate("common.saved") })
        handleOnCancel()
      } catch (e) {
        toast.error({ title: "Error saving" })
      }
    }

    const handleOnCancel = () => {
      setEditMode(undefined)
      bottomSheetModalRef.current?.dismiss()
    }

    const handleOnSave = () => {
      formRef.current.submitForm()
    }

    return (
      <>
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
                  <Text fontSize="lg" preset="subheading" tx="compliance.pageHeader"></Text>
                  <Text colorToken="text.softer" fontSize="md" tx="compliance.pageSubheader"></Text>
                </Stack>

                <PressableActionRow
                  tx="compliance.readMore"
                  icon={{
                    icon: "newspaper",
                  }}
                  onPress={onViewTCPA}
                ></PressableActionRow>

                <Stack space={spacing.extraSmall} px={spacing.tiny}>
                  <LabelValuePill.Boolean
                    label="compliance.autoSendMessage"
                    icon="arrowLeftRight"
                    onEdit={handleOnEdit}
                    trueTx={"compliance.autoSendIsOn"}
                    falseTx={"compliance.autoSendIsOff"}
                    value={dataComplianceMessage && dataComplianceMessage?.IsEnabled}
                  />

                  <LabelValuePill.Text
                    label="compliance.message"
                    icon="chatBubbleLeft"
                    onEdit={handleOnEditMessage}
                    text={dataComplianceMessage && dataComplianceMessage?.Message}
                  />
                </Stack>
              </Stack>
            )}
          </Box>
        </Screen>
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
          android_keyboardInputMode="adjustResize"
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
            {editMode === EditFormModeEnum.ISENABLED ? (
              <EditComplianceEnabledForm
                ref={formRef}
                data={{
                  IsEnabled: dataComplianceMessage.IsEnabled,
                }}
                onSubmit={handleOnSubmitEnabled}
              />
            ) : null}
            {editMode === EditFormModeEnum.MESSAGE ? (
              <EditComplianceMessageForm
                ref={formRef}
                userProfile={userProfile}
                data={{
                  Message: dataComplianceMessage.Message,
                }}
                onSubmit={handleOnSubmitMessage}
              />
            ) : null}
          </BottomSheetScrollView>
        </BottomSheetModal>
      </>
    )
  },
)

export const ComplianceScreen = gestureHandlerRootHOC(ComplianceScreenBase)
