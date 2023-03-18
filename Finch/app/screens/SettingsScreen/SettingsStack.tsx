import { CompositeScreenProps, DrawerActions } from "@react-navigation/native"
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"

import React, { FC } from "react"
import { UserAvatar } from "../../components/UserAvatar"
import { translate } from "../../i18n"
import { useStores } from "../../models"
import { AppDrawerScreenProps } from "../../navigators"

import { HEADER_TITLE_STYLES } from "../../theme"
import { useColor } from "../../theme/useColor"
import { BlockedScreen } from "./BlockedScreen"
import { CrmSyncScreen } from "./crmsync/CrmSync"
import { DeleteAccountScreen } from "./DeleteAccountScreen"
import { MyPhoneScreen } from "./MyPhoneScreen"
import { MySubscriptionScreen } from "./MySubscriptionScreen"
import { ProfileScreen } from "./profile/ProfileScreen"
import { SettingsScreen } from "./SettingsScreen"
import { SmsTemplatesScreen } from "./smstemplates/SmsTemplatesScreen"

export type SettingsStackParamList = {
  Settings: undefined
  Profile: undefined
  DeleteAccount: undefined
  Blocked: undefined
  MyPhone: undefined
  MySubscription: undefined
  CrmSync: undefined
  SmsTemplates: undefined
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
        name={"Blocked"}
        component={BlockedScreen}
        options={{
          headerTitle: translate("settings.blocked"),
          headerStyle: {
            backgroundColor: headerBg,
          },
        }}
      />
      <Stack.Screen
        name={"MyPhone"}
        component={MyPhoneScreen}
        options={{
          headerTitle: translate("settings.myPhone"),
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
        name={"CrmSync"}
        component={CrmSyncScreen}
        options={{
          headerTitle: translate("settings.crmSync"),
          headerStyle: {
            backgroundColor: headerBg,
          },
        }}
      />
      <Stack.Screen
        name={"SmsTemplates"}
        component={SmsTemplatesScreen}
        options={{
          headerTitle: translate("settings.smsTemplates"),
          headerStyle: {
            backgroundColor: headerBg,
          },
        }}
      />
    </Stack.Navigator>
  )
}
