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

import { gestureHandlerRootHOC } from "react-native-gesture-handler"
import { BusinessHourDaySchedule, IBusinessHoursForm } from "../../../models/CallFlow"
import useUpdateCallFlow from "../../../services/api/callflow/mutations/useUpdateCallFlow"
import useReadCallFlow from "../../../services/api/callflow/queries/useReadCallFlow"
import { EditDayScheduleForm, SCHEDULE_DAYS } from "./EditDayScheduleForm"
import { EditHoursEnabledForm } from "./EditHoursEnabledForm"
import { EditTimezoneForm } from "./EditTimezoneForm"

enum EditFormModeEnum {
  ISENABLED = "ISENABLED",
  TIMEZONE = "TIMEZONE",
  SCHEDULE = "SCHEDULE",
}

export type FormHandle = {
  submitForm: () => void
}

const BusinessHoursScreenBase: FC<SettingsStackScreenProps<"BusinessHours">> = observer(
  function BusinessHoursScreen(_props) {
    const [editDayIndex, setEditDayIndex] = React.useState<number>()
    const [editMode, setEditMode] = React.useState<EditFormModeEnum>()
    const bottomSheetModalRef = React.useRef<BottomSheetModal>(null)
    const formRef = React.useRef<FormHandle>(null)

    const snapPoints = React.useMemo(() => ["50%", "80%", "100%"], [])
    const { top: topInset, bottom: bottomInset } = useSafeAreaInsets()

    const toast = useCustomToast()

    const borderColor = useColor("text.softest")
    const bgHighColor = useColor("bg.high")

    const bgColor = useColor("bg.main")

    const { data: dataCallFlow, isLoading: isLoadingMessage } = useReadCallFlow()
    const { mutateAsync: mutateAsyncUpdate, isLoading: isLoadingUpdate } = useUpdateCallFlow()

    const handleOnEditEnabled = () => {
      setEditMode(EditFormModeEnum.ISENABLED)
      bottomSheetModalRef.current?.present()
    }

    const handleOnEditDay = (dayIdx: number) => {
      setEditDayIndex(dayIdx)
      setEditMode(EditFormModeEnum.SCHEDULE)
      bottomSheetModalRef.current?.present()
    }
    const handleOnEditTimezone = () => {
      setEditMode(EditFormModeEnum.TIMEZONE)
      bottomSheetModalRef.current?.present()
    }

    const handleOnSubmitEnabled = async (data: IBusinessHoursForm) => {
      try {
        await mutateAsyncUpdate(data)

        toast.success({ title: translate("common.saved") })
        handleOnCancel()
      } catch (e) {
        toast.error({ title: "Error saving" })
      }
    }
    const handleOnSubmitTimezone = async (data: IBusinessHoursForm) => {
      try {
        await mutateAsyncUpdate(data)

        toast.success({ title: translate("common.saved") })
        handleOnCancel()
      } catch (e) {
        toast.error({ title: "Error saving" })
      }
    }

    const handleOnSubmitSchedule = async (data: BusinessHourDaySchedule) => {
      const updateSchedule = dataCallFlow.BusinessSchedule

      updateSchedule[editDayIndex] = data

      const updateForm: IBusinessHoursForm = {
        BusinessSchedule: updateSchedule,
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
                  <Text fontSize="lg" preset="subheading" tx="businessHours.pageHeader"></Text>
                  <Text
                    colorToken="text.softer"
                    fontSize="md"
                    tx="businessHours.pageSubheader"
                  ></Text>
                </Stack>

                <Stack space={spacing.extraSmall} px={spacing.tiny}>
                  <LabelValuePill.Boolean
                    label="businessHours.businessHours"
                    icon="clock"
                    onEdit={handleOnEditEnabled}
                    trueTx={"businessHours.isOn"}
                    falseTx={"businessHours.isOff"}
                    value={dataCallFlow && dataCallFlow?.IsEnableBusinessHours}
                  />

                  <LabelValuePill.Text
                    label="businessHours.timezone"
                    icon="globeAlt"
                    onEdit={handleOnEditTimezone}
                    text={dataCallFlow && dataCallFlow?.BusinessTimezone}
                  />

                  {dataCallFlow && dataCallFlow.IsEnableBusinessHours ? (
                    <>
                      <Text textAlign={"center"} tx="businessHours.setSchedule"></Text>
                      {SCHEDULE_DAYS.map((dayTx, idx) => {
                        return (
                          <LabelValuePill.Hours
                            key={dayTx}
                            label={dayTx}
                            icon="calendarDays"
                            value={
                              dataCallFlow &&
                              dataCallFlow?.BusinessSchedule.length > idx + 1 &&
                              dataCallFlow?.BusinessSchedule[idx]
                            }
                            onEdit={() => handleOnEditDay(idx)}
                          />
                        )
                      })}
                    </>
                  ) : null}
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
              <EditHoursEnabledForm
                ref={formRef}
                data={{
                  IsEnableBusinessHours: dataCallFlow.IsEnableBusinessHours,
                }}
                onSubmit={handleOnSubmitEnabled}
              />
            ) : null}
            {editMode === EditFormModeEnum.TIMEZONE ? (
              <EditTimezoneForm
                ref={formRef}
                data={{
                  BusinessTimezone: dataCallFlow.BusinessTimezone,
                }}
                onSubmit={handleOnSubmitTimezone}
              />
            ) : null}
            {editMode === EditFormModeEnum.SCHEDULE && editDayIndex !== undefined ? (
              <EditDayScheduleForm
                ref={formRef}
                editDayIndex={editDayIndex}
                daySchedule={dataCallFlow.BusinessSchedule[editDayIndex]}
                onSubmit={handleOnSubmitSchedule}
              />
            ) : null}
          </BottomSheetScrollView>
        </BottomSheetModal>
      </>
    )
  },
)

export const BusinessHoursScreen = gestureHandlerRootHOC(BusinessHoursScreenBase)
