import { CompositeScreenProps, DrawerActions } from "@react-navigation/native"
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"

import React, { FC } from "react"
import { Icon } from "../../components"
import { UserAvatar } from "../../components/UserAvatar"
import { translate } from "../../i18n"
import { AppDrawerScreenProps } from "../../navigators"

import { HEADER_TITLE_STYLES } from "../../theme"
import { useColor } from "../../theme/useColor"
import { BlockedScreen } from "../SettingsScreen/BlockedScreen"
import { CrmSyncScreen } from "../SettingsScreen/crmsync/CrmSync"
import { ManageContactsScreen } from "./ManageContactsScreen"

export type ManageContactsStackParamList = {
  ManageContacts: undefined
  Blocked: undefined
  CrmSync: undefined
}

export type ManageContactsStackScreenProps<T extends keyof ManageContactsStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<ManageContactsStackParamList, T>,
    AppDrawerScreenProps<"ManageContactsStack">
  >

const Stack = createNativeStackNavigator<ManageContactsStackParamList>()

export const ManageContactsStack: FC<AppDrawerScreenProps<"ManageContactsStack">> = (_props) => {
  const { navigation } = _props

  const headerBg = useColor("bg.header")
  const bgMain = useColor("bg.main")

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
      }}
    >
      <Stack.Screen
        name={"ManageContacts"}
        component={ManageContactsScreen}
        options={{
          headerStyle: {
            backgroundColor: bgMain,
          },
          headerTitleStyle: {
            ...HEADER_TITLE_STYLES,
          },
          headerLeft: ({}) => {
            const handleOnPressSettings = () => {
              navigation.dispatch(DrawerActions.toggleDrawer())
            }

            return <UserAvatar size="sm" onPress={handleOnPressSettings}></UserAvatar>
          },
          headerRight: ({}) => {
            const handleOnPress = () => {
              navigation.getParent()?.navigate("Home")
            }

            return <Icon colorToken="text.softer" onPress={handleOnPress} icon="home" />
          },
          headerTitle: translate("contacts.manageContacts"),
        }}
      />

      {/* <Stack.Screen
        name={"TemplateGallery"}
        component={TemplateGalleryScreen}
        options={{
          headerTitle: translate("library.templateGallery"),
          headerStyle: {
            backgroundColor: headerBg,
          },
        }}
      /> */}

      <Stack.Screen
        name={"Blocked"}
        component={BlockedScreen}
        options={{
          headerTitle: translate("contacts.blocked"),
          headerStyle: {
            backgroundColor: headerBg,
          },
        }}
      />

      <Stack.Screen
        name={"CrmSync"}
        component={CrmSyncScreen}
        options={{
          headerTitle: translate("contacts.crmSync"),
          headerStyle: {
            backgroundColor: headerBg,
          },
        }}
      />
    </Stack.Navigator>
  )
}
