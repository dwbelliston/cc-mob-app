import { CompositeScreenProps, DrawerActions } from "@react-navigation/native"
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"

import React, { FC } from "react"
import { Icon } from "../../components"
import { UserAvatar } from "../../components/UserAvatar"
import { translate } from "../../i18n"
import { useStores } from "../../models"
import { AppDrawerScreenProps } from "../../navigators"

import { HEADER_TITLE_STYLES } from "../../theme"
import { useColor } from "../../theme/useColor"
import { DeleteAccountScreen } from "./DeleteAccountScreen"
import { MySubscriptionScreen } from "./MySubscriptionScreen"
import { DebugNotificationsScreen } from "./notifications/DebugNotificationsScreen"
import { NotificationsScreen } from "./notifications/NotificationsScreen"
import { ProfileScreen } from "./profile/ProfileScreen"
import { SettingsScreen } from "./SettingsScreen"

export type SettingsStackParamList = {
  Settings: undefined
  Profile: undefined
  DeleteAccount: undefined
  MySubscription: undefined
  Notifications: undefined
  DebugNotifications: undefined
}

export type SettingsStackScreenProps<T extends keyof SettingsStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<SettingsStackParamList, T>,
  AppDrawerScreenProps<"SettingsStack">
>

const Stack = createNativeStackNavigator<SettingsStackParamList>()

export const SettingsStack: FC<AppDrawerScreenProps<"SettingsStack">> = (_props) => {
  const { navigation } = _props

  const { contactsStore } = useStores()
  const headerLargeBg = useColor("bg.largeHeader")
  const headerBg = useColor("bg.header")

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
      }}
    >
      <Stack.Screen
        name={"Settings"}
        component={SettingsScreen}
        options={{
          headerLargeTitle: true,
          headerLargeTitleShadowVisible: false,
          headerLargeStyle: {
            backgroundColor: headerLargeBg,
          },
          headerStyle: {
            backgroundColor: headerBg,
          },
          headerLargeTitleStyle: {
            ...HEADER_TITLE_STYLES,
          },
          headerTitleStyle: {
            ...HEADER_TITLE_STYLES,
          },
          headerLeft: contactsStore.isHeaderSearchOpen
            ? null
            : ({}) => {
                const handleOnPressSettings = () => {
                  navigation.dispatch(DrawerActions.toggleDrawer())
                }

                return <UserAvatar size="sm" onPress={handleOnPressSettings}></UserAvatar>
              },
          headerRight: contactsStore.isHeaderSearchOpen
            ? null
            : ({}) => {
                const handleOnPress = () => {
                  navigation.getParent()?.navigate("Home")
                }

                return <Icon colorToken="text.softer" onPress={handleOnPress} icon="home" />
              },
          headerTitle: translate("navigator.settings"),
        }}
      />
      <Stack.Screen
        name={"Profile"}
        component={ProfileScreen}
        options={{
          headerTitle: translate("settings.myProfile"),
          headerStyle: {
            backgroundColor: headerBg,
          },
        }}
      />
      <Stack.Screen
        name={"DeleteAccount"}
        component={DeleteAccountScreen}
        options={{
          headerTitle: translate("settings.deleteAccount"),
          headerStyle: {
            backgroundColor: headerBg,
          },
        }}
      />
      <Stack.Screen
        name={"MySubscription"}
        component={MySubscriptionScreen}
        options={{
          headerTitle: translate("settings.mySubscription"),
          headerStyle: {
            backgroundColor: headerBg,
          },
        }}
      />

      <Stack.Screen
        name={"Notifications"}
        component={NotificationsScreen}
        options={{
          headerTitle: translate("settings.notifications"),
          headerStyle: {
            backgroundColor: headerBg,
          },
        }}
      />
      <Stack.Screen
        name={"DebugNotifications"}
        component={DebugNotificationsScreen}
        options={{
          headerTitle: translate("settings.debugNotifications"),
          headerStyle: {
            backgroundColor: headerBg,
          },
        }}
      />
    </Stack.Navigator>
  )
}
