import { CompositeScreenProps, DrawerActions } from "@react-navigation/native"
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"

import React, { FC } from "react"
import { Icon } from "../../components"
import { UserAvatar } from "../../components/UserAvatar"
import { translate } from "../../i18n"
import { AppDrawerScreenProps } from "../../navigators"

import { HEADER_TITLE_STYLES } from "../../theme"
import { useColor } from "../../theme/useColor"
import { AutoRepliesScreen } from "./autoreplies/AutoRepliesScreen"
import { BusinessHoursScreen } from "./businesshours/BusinessHoursScreen"

import { CallforwardingScreen } from "./callforwarding/CallforwardingScreen"
import { ComplianceScreen } from "./compliance/ComplianceScreen"
import { ManagePhoneScreen } from "./ManagePhoneScreen"
import { PhoneDetailsScreen } from "./PhoneDetailsScreen"
import { VoicemailScreen } from "./voicemail/VoicemailScreen"

export type ManagePhoneStackParamList = {
  ManagePhone: undefined
  Compliance: undefined
  Callforwarding: undefined
  PhoneDetails: undefined
  BusinessHours: undefined
  AutoReplies: undefined
  Voicemail: undefined
}

export type ManagePhoneStackScreenProps<T extends keyof ManagePhoneStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<ManagePhoneStackParamList, T>,
    AppDrawerScreenProps<"ManagePhoneStack">
  >

const Stack = createNativeStackNavigator<ManagePhoneStackParamList>()

export const ManagePhoneStack: FC<AppDrawerScreenProps<"ManagePhoneStack">> = (_props) => {
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
        name={"ManagePhone"}
        component={ManagePhoneScreen}
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
          headerTitle: translate("phoneSettings.managePhone"),
        }}
      />

      <Stack.Screen
        name={"Compliance"}
        component={ComplianceScreen}
        options={{
          headerTitle: translate("phoneSettings.compliance"),
          headerStyle: {
            backgroundColor: headerBg,
          },
        }}
      />
      <Stack.Screen
        name={"Callforwarding"}
        component={CallforwardingScreen}
        options={{
          headerTitle: translate("phoneSettings.callForwarding"),
          headerStyle: {
            backgroundColor: headerBg,
          },
        }}
      />
      <Stack.Screen
        name={"BusinessHours"}
        component={BusinessHoursScreen}
        options={{
          headerTitle: translate("phoneSettings.businessHours"),
          headerStyle: {
            backgroundColor: headerBg,
          },
        }}
      />

      <Stack.Screen
        name={"PhoneDetails"}
        component={PhoneDetailsScreen}
        options={{
          headerTitle: translate("phoneSettings.phoneDetails"),
          headerStyle: {
            backgroundColor: headerBg,
          },
        }}
      />
      <Stack.Screen
        name={"AutoReplies"}
        component={AutoRepliesScreen}
        options={{
          headerTitle: translate("phoneSettings.autoReplies"),
          headerStyle: {
            backgroundColor: headerBg,
          },
        }}
      />
      <Stack.Screen
        name={"Voicemail"}
        component={VoicemailScreen}
        options={{
          headerTitle: translate("phoneSettings.voicemail"),
          headerStyle: {
            backgroundColor: headerBg,
          },
        }}
      />
    </Stack.Navigator>
  )
}
