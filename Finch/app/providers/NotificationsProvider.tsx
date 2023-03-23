import * as Notifications from "expo-notifications"
import * as TaskManager from "expo-task-manager"
import React from "react"
import { Platform } from "react-native"
import * as Sentry from "sentry-expo"
import useGetCountUnreadConversations from "../services/api/conversations/queries/useGetCountUnreadConversations"
import { useCustomToast } from "../utils/useCustomToast"

export const BACKGROUND_NOTIFICATION_TASK = "CC-BACKGROUND-NOTIFICATION-TASK-V01"

const handleSetBadgeCountBackground = async (countBadge: number = 1) => {
  let isAllowSet = false

  try {
    const { granted, ios } = await Notifications.requestPermissionsAsync()

    if (Platform.OS === "android" && granted) {
      isAllowSet = true
    } else if (Platform.OS === "ios" && ios?.allowsBadge) {
      isAllowSet = true
    }

    if (isAllowSet) {
      try {
        await Notifications.setBadgeCountAsync(countBadge)
      } catch (e) {
        Sentry.Native.captureException(e)
      }
    }
  } catch (e) {
    Sentry.Native.captureException(e)
  }
}

const handleNewNotificationBackground = async (notificationObject: any) => {
  try {
    // const newNotification = {
    //   id: notificationObject.messageId,
    //   date: notificationObject.sentTime,
    //   title: notificationObject.data.title,
    //   body: notificationObject.data.message,
    //   data: JSON.parse(notificationObject.data.body),
    // };

    const currentBadgeCount = await Notifications.getBadgeCountAsync()
    await handleSetBadgeCountBackground(currentBadgeCount + 1)
  } catch (error) {
    Sentry.Native.captureException(error)
  }
}

// defines how device should handle a notification when the app is running (foreground notifications)
Notifications.setNotificationHandler({
  handleNotification: async () => {
    // Set badge?
    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }
  },
})

if (Platform.OS === "android") {
  Notifications.setNotificationChannelAsync("default", {
    name: "default",
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: "#FF231F7C",
  })
}

TaskManager.defineTask(
  BACKGROUND_NOTIFICATION_TASK,
  ({ data, error, executionInfo }: { data: any; error: any; executionInfo: any }) => {
    // Sentry.Native.captureEvent({ extra: data.notification })
    handleNewNotificationBackground(data.notification)
  },
)

interface IProps {
  children: React.ReactNode
}

export const NotificationsProvider = (props: IProps) => {
  const notificationListener = React.useRef<any>()
  const responseListener = React.useRef<any>()

  const { data: dataCountUnreadConversations } = useGetCountUnreadConversations()

  const toast = useCustomToast()

  const handleSetBadgeCountForeground = async (countBadge: number) => {
    let isAllowSet = false

    try {
      const { granted, ios } = await Notifications.requestPermissionsAsync()

      if (Platform.OS === "android" && granted) {
        isAllowSet = true
      } else if (Platform.OS === "ios" && ios?.allowsBadge) {
        isAllowSet = true
      }

      if (isAllowSet) {
        try {
          await Notifications.setBadgeCountAsync(countBadge)
        } catch (e) {
          Sentry.Native.captureException(e)
        }
      }
    } catch (e) {
      Sentry.Native.captureException(e)
    }
  }

  React.useEffect(() => {
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      Sentry.Native.captureMessage("Received notifcation")

      // notification: Notifications.Notification
      toast.info({ title: notification.request.content.title })
    })

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      Sentry.Native.captureMessage("Receive notifcation response")
    })

    // register task to run whenever is received while the app is in the background
    Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK)

    return () => {
      // Notifications.removeNotificationSubscription(responseListener.current);
      Notifications.unregisterTaskAsync(BACKGROUND_NOTIFICATION_TASK)
      Notifications.removeNotificationSubscription(notificationListener.current)
      Notifications.removeNotificationSubscription(responseListener.current)
    }
  }, [])

  React.useEffect(() => {
    const unreadCountBadge = parseInt(dataCountUnreadConversations)
    handleSetBadgeCountForeground(unreadCountBadge)
  }, [dataCountUnreadConversations])

  return <>{props.children}</>
}
