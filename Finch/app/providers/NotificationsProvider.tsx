import * as Notifications from "expo-notifications"
import React from "react"
import { Platform } from "react-native"
import useGetCountUnreadConversations from "../services/api/conversations/queries/useGetCountUnreadConversations"

const BACKGROUND_NOTIFICATION_TASK = "CC-BACKGROUND-NOTIFICATION-TASK-001"

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

interface IProps {
  children: React.ReactNode
}

export const NotificationsProvider = (props: IProps) => {
  const [notification, setNotification] = React.useState<Notifications.Notification>()
  const notificationListener = React.useRef<any>()
  const responseListener = React.useRef<any>()

  const { data: dataCountUnreadConversations } = useGetCountUnreadConversations()

  const handleSetBadgeCount = async (countBadge: number) => {
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
          // Sentry.Native.captureException(e);
        }
      }
    } catch (e) {
      // Sentry.Native.captureException(e);
      // const error: any = e;
      // try {
      //   if (error && error.toString) {
      //     set_hasError(error?.toString());
      //   }
      // } catch (error1) {
      //   set_hasError("has error");
      // }
    }
  }

  React.useEffect(() => {
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      console.log("HIT:::", notification)
      setNotification(notification)
    })

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log("HITresponse:::", notification)
      console.log(response)
    })

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current)
      Notifications.removeNotificationSubscription(responseListener.current)
    }
  }, [])

  React.useEffect(() => {
    const unreadCountBadge = parseInt(dataCountUnreadConversations)
    handleSetBadgeCount(unreadCountBadge)

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      })
    }
  }, [dataCountUnreadConversations])

  return <>{props.children}</>
}

// const handleNewNotification = async (notificationObject: any) => {
//   try {
//     // const newNotification = {
//     //   id: notificationObject.messageId,
//     //   date: notificationObject.sentTime,
//     //   title: notificationObject.data.title,
//     //   body: notificationObject.data.message,
//     //   data: JSON.parse(notificationObject.data.body),
//     // };

//     // Sentry.Native.captureEvent({ extra: notificationObject });

//     const currentBadgeCount = await Notifications.getBadgeCountAsync()
//     await handleSetBadgeCount(currentBadgeCount + 1)
//   } catch (error) {
//     // Sentry.Native.captureException(error);
//   }
// }

// TaskManager.defineTask(
//   BACKGROUND_NOTIFICATION_TASK,
//   ({ data, error, executionInfo }: { data: any; error: any; executionInfo: any }) => {
//     // Sentry.Native.captureEvent({ extra: data })
//     handleNewNotification(data.notification)
//   },
// )

// // const registerForPushNotificationsAsync = async () => {
// //   let token

// //   if (Device.isDevice) {
// //     const { status: existingStatus } = await Notifications.getPermissionsAsync()

// //     let finalStatus = existingStatus

// //     if (existingStatus !== "granted") {
// //       const { status } = await Notifications.requestPermissionsAsync()
// //       finalStatus = status
// //     }

// //     if (finalStatus !== "granted") {
// //       alert("Failed to get push token for push notification!")
// //       return
// //     }

// //     token = (await Notifications.getExpoPushTokenAsync()).data
// //     console.log(token)
// //   } else {
// //     // TODO this causes error on loading splash screen
// //     // alert("Must use physical device for Push Notifications");
// //   }

// //   if (Platform.OS === "android") {
// //     Notifications.setNotificationChannelAsync("default", {
// //       name: "default",
// //       importance: Notifications.AndroidImportance.MAX,
// //       vibrationPattern: [0, 250, 250, 250],
// //       lightColor: "#FF231F7C",
// //     })
// //   }

// //   return token
// // }

// const NotificationsProvider = ({ children }: { children: any }) => {
//   const [expoPushToken, setExpoPushToken] = React.useState<string | undefined>("")
//   const [hasError, set_hasError] = React.useState<any>("none")

//   // Handles to remove on unmount
//   const notificationListener = React.useRef<any>()
//   const responseListener = React.useRef<any>()

//   const { data: dataUserProfile } = useReadUserProfile()

//   // const {
//   //   mutateAsync: mutateAsyncDevice,
//   //   isLoading: isLoadingDevice,
//   //   isError: isErrorDevice,
//   //   status: statusCreateDevice,
//   //   error: errorCreateDevice,
//   // } = useCreateDeviceToken()

//   // const { data: dataUnreadConversations } = useListConversations({
//   //   pageLimit: 10,
//   //   search: null,
//   //   isUnread: true,
//   //   fromFolderId: null,
//   //   conversationStatus: null,
//   //   refetchInterval: 5000,
//   // })

//   // const createDeviceToken = async (deviceToken: ICreateConnectorDevice) => {
//   //   try {
//   //     await mutateAsyncDevice(deviceToken)
//   //   } catch (e) {
//   //     Sentry.Native.captureException(e)
//   //   }
//   // }

//   React.useEffect(() => {
//     registerForPushNotificationsAsync().then((token) => setExpoPushToken(token))

//     // // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
//     // responseListener.current =
//     //   Notifications.addNotificationResponseReceivedListener((response) => {
//     //     setNotification(notification);
//     //   });

//     // register task to run whenever is received while the app is in the background
//     Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK)

//     // listener triggered whenever a notification is received while the app is in the foreground
//     notificationListener.current = Notifications.addNotificationReceivedListener(
//       (notification: any) => {
//         handleNewNotification(notification.request.trigger.remoteMessage)
//       },
//     )

//     return () => {
//       // Notifications.removeNotificationSubscription(responseListener.current);
//       Notifications.unregisterTaskAsync(BACKGROUND_NOTIFICATION_TASK)

//       Notifications.removeNotificationSubscription(notificationListener.current)
//     }
//   }, [])

//   // React.useEffect(() => {
//   //   if (expoPushToken) {
//   //     if (expoPushToken && user) {
//   //       // brand
//   //       const deviceTokenUpdate = {
//   //         DeviceToken: expoPushToken,
//   //         DeviceName: Device.deviceName,
//   //         DeviceBrand: Device.brand,
//   //         DeviceModel: Device.modelName,
//   //       }

//   //       // Create device connector
//   //       createDeviceToken(deviceTokenUpdate)
//   //     }
//   //   }
//   // }, [expoPushToken, user])

//   // // Manage unread conversations badge count
//   // React.useEffect(() => {
//   //   let countUnread = 0

//   //   if (
//   //     dataUnreadConversations &&
//   //     dataUnreadConversations.pages &&
//   //     dataUnreadConversations.pages[0].meta.total > 0
//   //   ) {
//   //     countUnread = parseInt(dataUnreadConversations.pages[0].meta.total.toString())
//   //   }

//   //   // Put badge notifications
//   //   handleSetBadgeCount(countUnread)
//   // }, [dataUnreadConversations])

//   return <>{children}</>
// }
