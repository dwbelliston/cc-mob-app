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
import {
  IRoutingEventNameEnum,
  IRoutingFrequencyEnum,
  IRoutingRule,
} from "../../../models/RoutingRule"
import useCreateDeviceToken from "../../../services/api/connectors/mutations/useCreateDeviceToken"
import useListConnectors from "../../../services/api/connectors/queries/useListConnectors"
import useCreateRoutingRules from "../../../services/api/routingrules/mutations/useCreateRoutingRules"
import useUpdateRoutingRule from "../../../services/api/routingrules/mutations/useUpdateRoutingRule"
import useListRoutingRules from "../../../services/api/routingrules/queries/useListRoutingRules"
import { useColor } from "../../../theme/useColor"
import { useCustomToast } from "../../../utils/useCustomToast"
import { SettingsStackScreenProps } from "../SettingsStack"
import { EditIsEnabledForm, IEditIsEnabledFormInput } from "./EditIsEnabledForm"

enum EditFormModeEnum {
  ENABLE_MESSAGE = "ENABLE_MESSAGE",
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
    const [ruleIncomingMessage, setRuleIncomingMessage] = React.useState<IRoutingRule>()
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

    const { data: dataConnectors, isLoading: isLoadingConnectors } = useListConnectors()
    const { data: dataRoutingRules, isLoading: isLoadingRoutingRules } = useListRoutingRules()
    const { mutateAsync: mutateAsyncRoutingRule, isLoading: isLoadingCreateRoutingRule } =
      useCreateRoutingRules()
    const { mutateAsync: mutateAsyncRoutingRuleUpdate, isLoading: isLoadingRoutingRuleUpdate } =
      useUpdateRoutingRule()

    const { mutateAsync: mutateAsyncDevice, isLoading: isLoadingDevice } = useCreateDeviceToken()

    const handleOnEditMessageAlert = () => {
      setEditMode(EditFormModeEnum.ENABLE_MESSAGE)
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

    const createMessageRoutingRule = async () => {
      try {
        await mutateAsyncRoutingRule([
          {
            ConnectorId: deviceConnector.ConnectorId,
            ConnectorName: deviceConnector.ConnectorName,
            EventName: IRoutingEventNameEnum.MESSAGE_INCOMING,
            Frequency: IRoutingFrequencyEnum.STREAM,
            IsEnabled: true,
            IsMobileManaged: true,
            ConnectorType: deviceConnector.ConnectorType,
            ConnectorMeta: deviceConnector.Meta,
          },
        ])
      } catch (e) {
        toast.error({ title: translate("common.error") })
      }
    }
    const updateRoutingRule = async (routingRuleId, isEnabled) => {
      try {
        await mutateAsyncRoutingRuleUpdate({
          routingRuleId,
          updateData: { ...ruleIncomingMessage, IsEnabled: isEnabled },
        })
      } catch (e) {
        toast.error({ title: translate("common.error") })
      }
    }

    const onHandleGetHelp = async () => {
      navigation.navigate("DebugNotifications")
    }

    const registerDevice = async () => {
      try {
        // const token = "TEST0001"
        const token = await registerForPushNotificationsAsync()
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

    const handleOnSubmitMessageEnable = async (data: IEditIsEnabledFormInput) => {
      // If its enabled
      if (data.IsEnabled) {
        if (ruleIncomingMessage) {
          if (ruleIncomingMessage.IsEnabled) {
            // Nothing to do
          } else {
            // Turn it on
            await updateRoutingRule(ruleIncomingMessage.RoutingRuleId, data.IsEnabled)
          }
        } else {
          // Create rule
          await createMessageRoutingRule()
        }
      } else {
        // Not enabled
        if (ruleIncomingMessage) {
          if (ruleIncomingMessage.IsEnabled) {
            // Turn it off
            await updateRoutingRule(ruleIncomingMessage.RoutingRuleId, data.IsEnabled)
          } else {
            // Nothing to do
          }
        } else {
          // Nothing to do
        }
      }
      handleOnCancel()
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

    const handleOnSetRoutingRules = (
      deviceConnector: IConnector,
      dataRoutingRules: IRoutingRule[],
    ) => {
      const thisConnectorsRules = dataRoutingRules.filter(
        (connector) => connector.ConnectorId === deviceConnector.ConnectorId,
      )

      // Get routing rule for incoming message
      let foundRuleIncomingMessage = thisConnectorsRules.find(
        (connector) => connector.EventName == IRoutingEventNameEnum.MESSAGE_INCOMING,
      )

      setRuleIncomingMessage(foundRuleIncomingMessage)
    }

    React.useEffect(() => {
      if (dataConnectors?.records && expoPushToken) {
        handleOnSetDeviceConnector(expoPushToken, dataConnectors.records)
      }
    }, [expoPushToken, dataConnectors])

    React.useEffect(() => {
      if (dataRoutingRules?.records && deviceConnector) {
        handleOnSetRoutingRules(deviceConnector, dataRoutingRules.records)
      }
    }, [dataRoutingRules, deviceConnector])

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
                  {!deviceConnector && isLoadingDevice ? (
                    <Stack space={spacing.tiny}>
                      <Text tx="notifications.noDeviceRegisterNew"></Text>
                      <Box>
                        <Spinner></Spinner>
                      </Box>
                    </Stack>
                  ) : null}

                  <LabelValuePill.Boolean
                    label="notifications.registeredDevice"
                    icon="fingerPrint"
                    trueText={deviceConnector?.ConnectorName || expoDeviceId}
                    falseTx={"notifications.notRegistered"}
                    value={!!deviceConnector}
                  />

                  <LabelValuePill.Boolean
                    label="notifications.allowIncomingMessageAlert"
                    icon="chatBubbleLeftEllipsis"
                    trueTx={"notifications.isOn"}
                    falseTx={"notifications.isOff"}
                    value={!!ruleIncomingMessage?.IsEnabled}
                    onEdit={handleOnEditMessageAlert}
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
                  isLoading={isLoadingRoutingRuleUpdate || isLoadingCreateRoutingRule}
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
            {editMode === EditFormModeEnum.ENABLE_MESSAGE ? (
              <EditIsEnabledForm
                ref={formRef}
                data={{
                  IsEnabled: ruleIncomingMessage?.IsEnabled,
                }}
                onSubmit={handleOnSubmitMessageEnable}
              />
            ) : null}
          </BottomSheetScrollView>
        </BottomSheetModal>
      </>
    )
  },
)

export const NotificationsScreen = gestureHandlerRootHOC(NotificationsScreenBase)
