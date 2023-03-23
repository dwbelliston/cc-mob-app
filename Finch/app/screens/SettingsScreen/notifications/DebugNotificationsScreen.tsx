import * as Device from "expo-device"
import * as Notifications from "expo-notifications"
import { observer } from "mobx-react-lite"

import { Box, HStack, Stack, View } from "native-base"
import React, { FC } from "react"

import { Button, Screen, Text } from "../../../components"
import { spacing } from "../../../theme"

import * as WebBrowser from "expo-web-browser"
import { Platform } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Dot } from "../../../components/Dot"
import { PressableActionRow } from "../../../components/PressableActionRow"
import { translate } from "../../../i18n"
import { IConnectorTypeEnum } from "../../../models/Connector"
import useListConnectors from "../../../services/api/connectors/queries/useListConnectors"
import { useColor } from "../../../theme/useColor"
import { useCustomToast } from "../../../utils/useCustomToast"
import { runFormatDateWithAt } from "../../../utils/useFormatDate"
import { SettingsStackScreenProps } from "../SettingsStack"

interface ILogItem {
  isInfo?: boolean
  isError?: boolean
  isSuccess?: boolean
  message: string
}

export const DebugNotificationsScreen: FC<SettingsStackScreenProps<"DebugNotifications">> =
  observer(function DebugNotificationsScreen(_props) {
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
      toast.info({ title: translate("notifications.sendingTest") })
      const message = {
        to: expoPushToken,
        sound: "default",
        title: translate("notifications.testTitle"),
        body: translate("notifications.testBody"),
        data: { someData: "EXAMPLE" },
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

    React.useEffect(() => {
      notificationListener.current = Notifications.addNotificationReceivedListener(
        (notification) => {
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
              <Text
                colorToken="text.softer"
                fontSize="md"
                tx="notifications.pageSubheaderDebug"
              ></Text>
            </Stack>

            <Stack space={spacing.extraSmall} px={spacing.tiny}>
              <Stack>
                {debugLog.map((logItem) => {
                  return (
                    <HStack key={logItem.message} space={spacing.tiny} alignItems="center">
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
                <Button tx="notifications.sendTest" onPress={sendPushNotification}></Button>
              ) : null}
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

            <Stack space={spacing.tiny} px={spacing.tiny}>
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
