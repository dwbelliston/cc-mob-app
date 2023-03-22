import { observer } from "mobx-react-lite"
import { Box, HStack, Spinner, Stack } from "native-base"
import React, { FC } from "react"

import { Button, Screen, Text } from "../../../components"
import { LabelValuePill } from "../../../components/LabelValuePill"
import { spacing } from "../../../theme"

import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { translate } from "../../../i18n"

import { gestureHandlerRootHOC } from "react-native-gesture-handler"
import { ICallForwardingForm } from "../../../models/CallFlow"
import useUpdateCallFlow from "../../../services/api/callflow/mutations/useUpdateCallFlow"
import useReadCallFlow from "../../../services/api/callflow/queries/useReadCallFlow"
import useReadUserProfile from "../../../services/api/userprofile/queries/useReadUserProfile"
import { useColor } from "../../../theme/useColor"
import { useCustomToast } from "../../../utils/useCustomToast"
import { runFormatPhoneSimple } from "../../../utils/useFormatPhone"
import { SettingsStackScreenProps } from "../SettingsStack"
import { EditCallforwardingForm } from "./EditCallforwardingForm"

enum EditFormModeEnum {
  EDIT = "EDIT",
}

export type FormHandle = {
  submitForm: () => void
}

const CallforwardingScreenBase: FC<SettingsStackScreenProps<"Callforwarding">> = observer(
  function CallforwardingScreen(_props) {
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
    const { data: dataCallFlow, isLoading: isLoadingCallflow } = useReadCallFlow()
    const { mutateAsync: mutateAsyncUpdate, isLoading: isLoadingUpdate } = useUpdateCallFlow()

    const handleOnUpdate = async (data: ICallForwardingForm) => {
      try {
        await mutateAsyncUpdate(data)

        toast.success({ title: translate("common.saved") })
        handleOnCancel()
      } catch (e) {
        toast.error({ title: "Error saving" })
      }
    }

    const handleOnEdit = () => {
      setEditMode(EditFormModeEnum.EDIT)
      bottomSheetModalRef.current?.present()
    }

    const handleOnCancel = () => {
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
          {isLoadingCallflow ? (
            <Spinner></Spinner>
          ) : (
            <Stack space={spacing.extraSmall}>
              <Stack px={spacing.tiny}>
                <Text fontSize="lg" preset="subheading" tx="callforwarding.pageHeader"></Text>
                <Text
                  colorToken="text.softer"
                  fontSize="md"
                  tx="callforwarding.pageSubheader"
                ></Text>
              </Stack>

              <Stack space={spacing.extraSmall} px={spacing.tiny}>
                <LabelValuePill.Boolean
                  label="callforwarding.status"
                  icon="phoneArrowUpRight"
                  onEdit={handleOnEdit}
                  trueTx={"callforwarding.isOn"}
                  falseTx={"callforwarding.isOff"}
                  value={dataCallFlow && dataCallFlow?.IsEnableForwardCall}
                />

                <LabelValuePill.Text
                  label="callforwarding.number"
                  icon="hashtag"
                  onEdit={handleOnEdit}
                  text={runFormatPhoneSimple(dataCallFlow && dataCallFlow?.NumberForwardTo)}
                />
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
            {editMode === EditFormModeEnum.EDIT ? (
              <EditCallforwardingForm
                ref={formRef}
                data={{
                  IsEnableForwardCall: dataCallFlow.IsEnableForwardCall,
                  NumberForwardTo: dataCallFlow.NumberForwardTo,
                }}
                onSubmit={handleOnUpdate}
              />
            ) : null}
          </BottomSheetScrollView>
        </BottomSheetModal>
      </Screen>
    )
  },
)

export const CallforwardingScreen = gestureHandlerRootHOC(CallforwardingScreenBase)
