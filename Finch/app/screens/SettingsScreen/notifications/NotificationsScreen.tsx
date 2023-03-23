import * as Device from "expo-device"
import * as Notifications from "expo-notifications"
import { observer } from "mobx-react-lite"

import { Box, HStack, Spinner, Stack } from "native-base"
import React, { FC } from "react"

import { Button, Screen, Text } from "../../../components"
import { LabelValuePill } from "../../../components/LabelValuePill"
import useReadUserProfile from "../../../services/api/userprofile/queries/useReadUserProfile"
import { spacing } from "../../../theme"

import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet"
import { gestureHandlerRootHOC } from "react-native-gesture-handler"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { PressableActionRow } from "../../../components/PressableActionRow"
import { translate } from "../../../i18n"
import { IConnector, ICreateConnectorDevice } from "../../../models/Connector"
import useCreateDeviceToken from "../../../services/api/connectors/mutations/useCreateDeviceToken"
import useListConnectors from "../../../services/api/connectors/queries/useListConnectors"
import useReadConnector from "../../../services/api/connectors/queries/useReadConnector"
import useUpdateCrmSync from "../../../services/api/crmsync/mutations/useUpdateCrmSync"
import useReadCrmSync from "../../../services/api/crmsync/queries/useReadCrmSync"
import { useColor } from "../../../theme/useColor"
import { useCustomToast } from "../../../utils/useCustomToast"
import { SettingsStackScreenProps } from "../SettingsStack"

enum EditFormModeEnum {
  ISENABLED = "ISENABLED",
}

export type FormHandle = {
  submitForm: () => void
}

const runGetExpoDeviceId = (fullTokenIn) => {
  // ExponentPushToken[ac-Fm6F88P2QUk6vQHzzRf] >>> ac-Fm6F88P2QUk6vQHzzRf
  let cleaned = fullTokenIn.replace("ExponentPushToken", "").replace("[", "").replace("]", "")
  cleaned = cleaned.replace(/^a-zA-Z0-9-/g, "")
  return cleaned
}

export const NotificationsScreenBase: FC<SettingsStackScreenProps<"MySubscription">> = observer(
  function NotificationsScreen(_props) {
    const { navigation } = _props
    const [deviceConnector, setDeviceConnector] = React.useState<IConnector>()
    const [expoDeviceId, setExpoDeviceId] = React.useState<string>()
    const [expoPushToken, setExpoPushToken] = React.useState("")

    const [editMode, setEditMode] = React.useState<EditFormModeEnum>()
    const bottomSheetModalRef = React.useRef<BottomSheetModal>(null)
    const formRef = React.useRef<FormHandle>(null)

    const snapPoints = React.useMemo(() => ["50%", "80%"], [])
    const { top: topInset, bottom: bottomInset } = useSafeAreaInsets()

    const toast = useCustomToast()

    const borderColor = useColor("text.softest")
    const bgHighColor = useColor("bg.high")
    const bgCard = useColor("bg.high")
    const bgColor = useColor("bg.main")

    const { data: userProfile, isLoading: isLoadingProfile } = useReadUserProfile()
    const { data: dataCrmSync, isLoading: isLoadingCrmSync } = useReadCrmSync(userProfile?.UserId)
    const { mutateAsync: mutateAsyncUpdate, isLoading: isLoadingUpdate } = useUpdateCrmSync()
    const { data: dataConnector } = useReadConnector(dataCrmSync?.ConnectorId)
    const { data: dataConnectors, isLoading: isLoadingConnectors } = useListConnectors()

    const {
      mutateAsync: mutateAsyncDevice,
      isLoading: isLoadingDevice,
      isError: isErrorDevice,
      status: statusCreateDevice,
      error: errorCreateDevice,
    } = useCreateDeviceToken()

    const handleOnEdit = () => {
      setEditMode(EditFormModeEnum.ISENABLED)
      bottomSheetModalRef.current?.present()
    }

    const registerForPushNotificationsAsync = async () => {
      // Get the push token ID

      let token

      if (!Device.isDevice) {
        throw new Error("")
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync()
      let finalStatus = existingStatus
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync()
        finalStatus = status
      }

      if (finalStatus !== "granted") {
        throw new Error("")
      }

      token = (await Notifications.getExpoPushTokenAsync()).data

      return token
    }

    const onHandleGetHelp = async () => {
      navigation.navigate("DebugNotifications")
    }

    const registerDevice = async () => {
      try {
        const token = "TEST0001"
        // const token = await registerForPushNotificationsAsync()
        setExpoPushToken(token)
      } catch (e) {
        toast.warning({
          title: translate("common.error"),
          description: translate("notifications.failedToGetId"),
        })
      }
    }

    const handleOnCreateConnector = async (
      expoPushTokenIn: string,
      expoPushTokenDeviceIdIn: string,
    ) => {
      const createDevice: ICreateConnectorDevice = {
        ExpoPushToken: expoPushTokenIn,
        DeviceId: expoPushTokenDeviceIdIn,
        DeviceName: Device.deviceName,
        DeviceBrand: Device.brand,
        DeviceModel: Device.modelName,
      }
      try {
        const connector = await mutateAsyncDevice(createDevice)
        setDeviceConnector(connector)
      } catch (e) {
        toast.error({
          title: translate("common.error"),
          description: translate("notifications.failedToRegister"),
        })
        // Sentry.Native.captureException(e)
      }
    }

    const handleOnSubmitEnabled = async (data: any) => {
      // if (userProfile?.UserId) {
      //   try {
      //     await mutateAsyncUpdate({
      //       userId: userProfile.UserId,
      //       updateData: { IsEnabled: data.IsEnabled },
      //     })
      //     toast.success({ title: translate("common.saved") })
      //     handleOnCancel()
      //   } catch (e) {
      //     toast.error({ title: "Error saving" })
      //   }
      // }
    }

    const handleOnCancel = () => {
      setEditMode(undefined)
      bottomSheetModalRef.current?.dismiss()
    }

    const handleOnSave = () => {
      formRef.current.submitForm()
    }

    const handleOnSetDeviceConnector = (expoPushToken: string, dataConnectors: IConnector[]) => {
      const expoPushTokenDeviceId = runGetExpoDeviceId(expoPushToken)

      setExpoDeviceId(expoPushTokenDeviceId)

      let foundDeviceConnector = dataConnectors.find((connector) => {
        connector.ConnectorId.includes(expoPushTokenDeviceId)
      })

      if (!foundDeviceConnector) {
        handleOnCreateConnector(expoPushToken, expoPushTokenDeviceId)
      }

      setDeviceConnector(foundDeviceConnector)
    }

    React.useEffect(() => {
      if (dataConnectors?.records && expoPushToken) {
        handleOnSetDeviceConnector(expoPushToken, dataConnectors.records)
      }
    }, [expoPushToken, dataConnectors])

    React.useEffect(() => {
      // Set the device id
      registerDevice()
    }, [])

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
            {isLoadingProfile ? (
              <Spinner></Spinner>
            ) : (
              <Stack space={spacing.extraSmall}>
                <Stack px={spacing.tiny}>
                  <Text fontSize="lg" preset="subheading" tx="notifications.pageHeader"></Text>
                  <Text
                    colorToken="text.softer"
                    fontSize="md"
                    tx="notifications.pageSubheader"
                  ></Text>
                </Stack>

                <Stack space={spacing.extraSmall} px={spacing.tiny}>
                  <LabelValuePill.Boolean
                    label="notifications.registeredDevice"
                    icon="fingerPrint"
                    trueText={deviceConnector?.ConnectorName || expoDeviceId}
                    falseTx={"notifications.notRegistered"}
                    value={!!deviceConnector}
                  />

                  {isLoadingDevice ? (
                    <Stack space={spacing.tiny}>
                      <Text tx="notifications.noDeviceRegisterNew"></Text>
                      <Box>
                        <Spinner></Spinner>
                      </Box>
                    </Stack>
                  ) : null}

                  <LabelValuePill.Boolean
                    label="notifications.allowBadge"
                    icon="bellAlert"
                    onEdit={handleOnEdit}
                    value={dataCrmSync && dataCrmSync?.IsEnabled}
                  />
                  <LabelValuePill.Boolean
                    label="notifications.allowIncomingAlert"
                    icon="chatBubbleLeftEllipsis"
                    onEdit={handleOnEdit}
                    value={dataCrmSync && dataCrmSync?.IsEnabled}
                  />
                </Stack>

                <PressableActionRow
                  tx="notifications.troubleshoot"
                  icon={{
                    icon: "lifebuoy",
                  }}
                  onPress={onHandleGetHelp}
                ></PressableActionRow>
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
                tx="crmSync.edit"
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
            {/* {editMode === EditFormModeEnum.ISENABLED ? (
              <EditCRMSyncEnabledForm
                ref={formRef}
                data={{
                  IsEnabled: dataCrmSync.IsEnabled,
                }}
                onSubmit={handleOnSubmitEnabled}
              />
            ) : null} */}
          </BottomSheetScrollView>
        </BottomSheetModal>
      </>
    )
  },
)

export const NotificationsScreen = gestureHandlerRootHOC(NotificationsScreenBase)
