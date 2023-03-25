import * as Device from "expo-device"
import * as Notifications from "expo-notifications"
import * as TaskManager from "expo-task-manager"
import { observer } from "mobx-react-lite"

import { Box, HStack, Stack, View } from "native-base"
import React, { FC } from "react"

import { Button, Screen, Text } from "../../../components"
import { spacing } from "../../../theme"

import * as WebBrowser from "expo-web-browser"
import { Platform } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Dot } from "../../../components/Dot"
import { LabelValuePill } from "../../../components/LabelValuePill"
import { PressableActionRow } from "../../../components/PressableActionRow"
import { translate } from "../../../i18n"
import { IConnectorTypeEnum } from "../../../models/Connector"
import { BACKGROUND_NOTIFICATION_TASK } from "../../../providers/NotificationsProvider"
import useListConnectors from "../../../services/api/connectors/queries/useListConnectors"
import { useColor } from "../../../theme/useColor"
import { useCustomToast } from "../../../utils/useCustomToast"
import { runFormatDateWithAt, runTodayTimestamp } from "../../../utils/useFormatDate"
import { SettingsStackScreenProps } from "../SettingsStack"

interface ILogItem {
  isInfo?: boolean
  isError?: boolean
  isSuccess?: boolean
  message: string
}

export const DebugNotificationsScreen: FC<SettingsStackScreenProps<"DebugNotifications">> =
  observer(function DebugNotificationsScreen(_props) {
    const [isBackgroungTaskRunning, setIsBackgroungTaskRunning] = React.useState<boolean>()
    const [debugLog, setDebugLog] = React.useState<ILogItem[]>([])
    const [expoPushToken, setExpoPushToken] = React.useState("")
    const [notification, setNotification] = React.useState<Notifications.Notification>()
    const notificationListener = React.useRef<any>()

    const { bottom: bottomInset } = useSafeAreaInsets()
    const toast = useCustomToast()

    const borderColor = useColor("text.softest")

    const { data: dataConnectors } = useListConnectors()

    // Can use this function below OR use Expo's Push Notification Tool from: https://expo.dev/notifications
    const sendPushNotification = async () => {
      setDebugLog((prevValues) => [...prevValues, { message: "Sending test...", isInfo: true }])

      const today = runTodayTimestamp()

      const message = {
        to: expoPushToken,
        sound: "default",
        title: translate("notifications.testTitle"),
        body: translate("notifications.testBody"),
        data: { time: `${today}` },
      }

      await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Accept-encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      })
    }

    const registerForPushNotificationsAsync = async () => {
      let token

      setDebugLog((prevValues) => [...prevValues, { message: "Checking device...", isInfo: true }])

      if (Device.isDevice) {
        setDebugLog((prevValues) => [
          ...prevValues,
          { message: "Device is valid", isSuccess: true },
        ])

        setDebugLog((prevValues) => [
          ...prevValues,
          { message: "Checking permissions...", isInfo: true },
        ])

        const { status: existingStatus } = await Notifications.getPermissionsAsync()

        let finalStatus = existingStatus

        if (existingStatus !== "granted") {
          setDebugLog((prevValues) => [
            ...prevValues,
            { message: `Permissions status is ${existingStatus}`, isError: true },
          ])
          setDebugLog((prevValues) => [
            ...prevValues,
            { message: `Requesting permissions...`, isInfo: true },
          ])
          const { status } = await Notifications.requestPermissionsAsync()
          setDebugLog((prevValues) => [
            ...prevValues,
            { message: `New permissions status is ${status}`, isInfo: true },
          ])

          finalStatus = status
        }

        if (finalStatus !== "granted") {
          setDebugLog((prevValues) => [
            ...prevValues,
            {
              message: `Permissions still not granted, please allow notifications at the device settings level`,
              isError: true,
            },
          ])

          return
        }

        setDebugLog((prevValues) => [
          ...prevValues,
          { message: `Permissions are correct`, isSuccess: true },
        ])

        setDebugLog((prevValues) => [
          ...prevValues,
          { message: `Getting device token...`, isInfo: true },
        ])

        try {
          const res = await Notifications.getExpoPushTokenAsync()
          token = res.data
          setDebugLog((prevValues) => [
            ...prevValues,
            { message: `Device token is: ${token}`, isSuccess: true },
          ])
        } catch (e) {
          setDebugLog((prevValues) => [
            ...prevValues,
            { message: `Failed to get device token`, isError: true },
          ])
          return
        }
      } else {
        setDebugLog((prevValues) => [
          ...prevValues,
          { message: "Device is not valid", isError: true },
        ])
        toast.warning({ title: "Not real device" })
      }

      if (token) {
        setDebugLog((prevValues) => [...prevValues, { message: "Ready to test!", isSuccess: true }])
      } else {
        setDebugLog((prevValues) => [
          ...prevValues,
          { message: "Could not get device token", isError: true },
        ])
      }

      setExpoPushToken(token)
    }

    const openUrlInBrowser = (url) => {
      WebBrowser.openBrowserAsync(url)
    }

    const runDebug = async () => {
      registerForPushNotificationsAsync()
    }
    const runTaskCheck = async () => {
      const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_NOTIFICATION_TASK)
      setIsBackgroungTaskRunning(isRegistered)
    }

    const runPermCheck = async () => {
      const { granted, ios } = await Notifications.requestPermissionsAsync()
      if (Platform.OS === "ios") {
        if (ios.allowsAlert) {
          setDebugLog((prevValues) => [
            ...prevValues,
            { message: "iOS allows alerts", isSuccess: true },
          ])
        } else {
          setDebugLog((prevValues) => [
            ...prevValues,
            { message: "iOS doesnt allow alerts", isError: true },
          ])
        }
        if (ios.allowsBadge) {
          setDebugLog((prevValues) => [
            ...prevValues,
            { message: "iOS allows red badge", isSuccess: true },
          ])
        } else {
          setDebugLog((prevValues) => [
            ...prevValues,
            { message: "iOS doesnt allow red badge", isError: true },
          ])
        }
        if (ios.allowsDisplayOnLockScreen) {
          setDebugLog((prevValues) => [
            ...prevValues,
            { message: "iOS allows display on lock screen", isSuccess: true },
          ])
        } else {
          setDebugLog((prevValues) => [
            ...prevValues,
            { message: "iOS doesnt allow display on lock screen", isError: true },
          ])
        }
      }
    }

    React.useEffect(() => {
      notificationListener.current = Notifications.addNotificationReceivedListener(
        (notification) => {
          setDebugLog((prevValues) => [
            ...prevValues,
            { message: "Received test", isSuccess: true },
          ])
          setNotification(notification)
        },
      )

      return () => {
        Notifications.removeNotificationSubscription(notificationListener.current)
      }
    }, [])

    React.useEffect(() => {
      setDebugLog([])
      runDebug()
      runTaskCheck()
      runPermCheck()
    }, [])

    return (
      <Screen
        preset="scroll"
        contentContainerStyle={{
          paddingBottom: bottomInset + spacing.large,
        }}
        style={{}}
      >
        <Box py={spacing.extraSmall}>
          <Stack space={spacing.extraSmall}>
            <Stack px={spacing.tiny}>
              <Text fontSize="lg" preset="subheading" tx="notifications.pageHeaderDebug"></Text>
              <Text colorToken="text.softer" tx="notifications.pageSubheaderDebug"></Text>
            </Stack>

            <Stack>
              {Platform.OS === "ios" ? (
                <>
                  <PressableActionRow
                    tx="notifications.urlHowToVideoPermissions"
                    icon={{
                      icon: "tv",
                    }}
                    onPress={() => openUrlInBrowser("https://www.youtube.com/watch?v=wghIhaiTq70")}
                  ></PressableActionRow>
                  <PressableActionRow
                    tx="notifications.urlHowToVideoSummary"
                    icon={{
                      icon: "tv",
                    }}
                    onPress={() => openUrlInBrowser("https://www.youtube.com/watch?v=fvEqJ4mRy9Q")}
                  ></PressableActionRow>
                  <PressableActionRow
                    tx="notifications.urlHowToBackgroundRefresh"
                    icon={{
                      icon: "newspaper",
                    }}
                    onPress={() =>
                      openUrlInBrowser(
                        "https://support.apple.com/en-us/HT202070#:~:text=Use%20Background%20App%20Refresh&text=If%20you%20want%20suspended%20apps,before%20you%20open%20it%20again.",
                      )
                    }
                  ></PressableActionRow>
                  <PressableActionRow
                    tx="notifications.urlArticalTurnOffDisturb"
                    icon={{
                      icon: "newspaper",
                    }}
                    onPress={() => openUrlInBrowser("https://support.apple.com/en-us/HT204321")}
                  ></PressableActionRow>
                </>
              ) : (
                <>
                  <PressableActionRow
                    tx="notifications.urlHowToVideoPermissions"
                    icon={{
                      icon: "tv",
                    }}
                    onPress={() => openUrlInBrowser("https://www.youtube.com/watch?v=_xKeUdcIGN4")}
                  ></PressableActionRow>
                  <PressableActionRow
                    tx="notifications.urlArticalTurnOffDisturb"
                    icon={{
                      icon: "newspaper",
                    }}
                    onPress={() =>
                      openUrlInBrowser(
                        "https://support.google.com/googlenest/answer/7552172?hl=en-AU&co=GENIE.Platform%3DAndroid",
                      )
                    }
                  ></PressableActionRow>
                  <PressableActionRow
                    tx="notifications.urlArticlePermissions"
                    icon={{
                      icon: "newspaper",
                    }}
                    onPress={() =>
                      openUrlInBrowser(
                        "https://www.lifewire.com/how-to-fix-it-when-notifications-are-not-showing-up-on-android-5191032",
                      )
                    }
                  ></PressableActionRow>
                </>
              )}
            </Stack>

            <Stack space={spacing.extraSmall} px={spacing.tiny}>
              <Stack>
                <HStack space={spacing.tiny} alignItems="center">
                  {isBackgroungTaskRunning ? (
                    <>
                      <Dot.Success></Dot.Success>
                      <Text text="Listening for notifications"></Text>
                    </>
                  ) : (
                    <>
                      <Dot.Error></Dot.Error>
                      <Text text="Not listening for background notifications"></Text>
                    </>
                  )}
                </HStack>
                {debugLog.map((logItem, idx) => {
                  return (
                    <HStack
                      key={`${logItem.message}-${idx}`}
                      space={spacing.tiny}
                      alignItems="center"
                    >
                      {logItem.isInfo ? <Dot.Info></Dot.Info> : null}
                      {logItem.isSuccess ? <Dot.Success></Dot.Success> : null}
                      {logItem.isError ? <Dot.Error></Dot.Error> : null}
                      <Text flex={1} text={logItem.message} />
                    </HStack>
                  )
                })}
              </Stack>

              {notification ? (
                <View borderWidth={1} borderColor={borderColor} rounded="lg" p={spacing.micro}>
                  <Text colorToken={"text.soft"}>Test Notification Information</Text>
                  <Text>Title: {notification && notification.request.content.title} </Text>
                  <Text>Body: {notification && notification.request.content.body}</Text>
                  <Text>
                    Data: {notification && JSON.stringify(notification.request.content.data)}
                  </Text>
                </View>
              ) : null}

              {expoPushToken ? (
                <Button
                  tx="notifications.sendTest"
                  colorScheme="indigo"
                  onPress={sendPushNotification}
                ></Button>
              ) : null}
            </Stack>

            <Stack space={spacing.tiny} px={spacing.tiny}>
              <LabelValuePill.Text
                label="notifications.registeredDevice"
                icon="devicePhoneMobile"
                isCopy={true}
                text={expoPushToken}
              />
              <Text
                colorToken="text.softer"
                fontSize="md"
                tx="notifications.existingMobileConnectors"
              ></Text>

              <Stack space={spacing.tiny}>
                {dataConnectors?.records
                  ?.filter((connector) => connector.ConnectorType === IConnectorTypeEnum.MOBILE)
                  .map((connector) => {
                    return (
                      <Box
                        key={connector.ConnectorId}
                        borderWidth={1}
                        borderColor={borderColor}
                        rounded="lg"
                        p={spacing.micro}
                      >
                        <Text noOfLines={1} fontSize="md" text={connector.ConnectorName}></Text>
                        <HStack alignItems={"center"} justifyContent="space-between">
                          <Text fontSize="xs" text={connector.ConnectorType}></Text>
                          <Text
                            fontSize="xs"
                            colorToken={"text.softer"}
                            text={`Created ${runFormatDateWithAt(connector.CreatedAt)}`}
                          ></Text>
                        </HStack>
                      </Box>
                    )
                  })}
              </Stack>
            </Stack>
          </Stack>
        </Box>
      </Screen>
    )
  })
