import { BottomTabScreenProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { CompositeScreenProps, DrawerActions } from "@react-navigation/native"

import { useColorModeValue } from "native-base"
import React, { FC } from "react"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Icon } from "../components"

import { translate } from "../i18n"

import { UserAvatar } from "../components/UserAvatar"
import { UserPhone } from "../components/UserPhone"
import { AccountStatusBanner } from "../providers/AccountStatusBanner"
import { ContactsStack } from "../screens/ContactsScreen/ContactsStack"
import { ConversationsStack } from "../screens/ConversationsScreen/ConversationsStack"
import { KeypadScreen } from "../screens/KeypadScreen/KeypadScreen"
import useGetCountUnreadConversations from "../services/api/conversations/queries/useGetCountUnreadConversations"
import useReadUserProfile from "../services/api/userprofile/queries/useReadUserProfile"
import { HEADER_TITLE_STYLES, colors, spacing } from "../theme"
import { useColor } from "../theme/useColor"
import { AppDrawerScreenProps } from "./AppDrawerNavigator"

export type HomeTabParamList = {
  ConversationsStack: undefined
  ContactsStack: undefined
  Keypad: undefined
}

/**
 * Helper for automatically generating navigation prop types for each route.
 *
 * More info: https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type HomeTabScreenProps<T extends keyof HomeTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<HomeTabParamList, T>,
  AppDrawerScreenProps<"Home">
>

const Tab = createBottomTabNavigator<HomeTabParamList>()

export const HomeTabNavigator: FC<AppDrawerScreenProps<"Home">> = (_props) => {
  const { navigation, route } = _props

  const { bottom } = useSafeAreaInsets()

  const { data: dataCountUnreadConversations } = useGetCountUnreadConversations()
  const { data: userProfile } = useReadUserProfile()

  const unreadCountBadge = parseInt(dataCountUnreadConversations)

  // const tabBg = useColorModeValue(colors.gray[50], colors.gray[900])
  const tabBorder = useColorModeValue(colors.gray[100], colors.gray[800])

  const tabIconColorActive = useColorModeValue(colors.gray[900], colors.white)
  const tabIconColorInActive = useColorModeValue(colors.gray[400], colors.gray[600])

  const tabBg = useColor("bg.main")
  const headerBg = useColor("bg.main")

  // const hide = route.name != "Profile"

  return (
    <Tab.Navigator
      id="HomeTabNavigator"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: tabIconColorActive,
        tabBarInactiveTintColor: tabIconColorInActive,
        tabBarStyle: {
          borderTopWidth: 1,
          paddingTop: 4,
          borderTopColor: tabBorder,
          backgroundColor: tabBg,
          height: bottom + 64,
        },
        tabBarLabelPosition: "below-icon",
        tabBarIconStyle: {
          flex: 1,
        },
        tabBarBadgeStyle: {
          // top: 2,
          // fontSize: 14,
        },
      }}
    >
      <Tab.Screen
        name="ConversationsStack"
        component={ConversationsStack}
        options={{
          headerShown: true,
          header: () => <AccountStatusBanner></AccountStatusBanner>,
          title: "Inbox",
          tabBarAccessibilityLabel: translate("navigator.inboxTab"),
          tabBarLabel: translate("navigator.inboxTab"),
          tabBarBadge: unreadCountBadge ? unreadCountBadge : null,
          tabBarIcon: ({ focused }) => (
            <Icon
              size={28}
              color={focused ? tabIconColorActive : tabIconColorInActive}
              icon="chat"
              isOutline={focused ? false : true}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Keypad"
        component={KeypadScreen}
        options={{
          headerShown: true,
          headerBackgroundContainerStyle: {
            borderBottomWidth: 2,
            borderBottomColor: tabBorder,
            backgroundColor: headerBg,
            // height: bottom + 80,
          },

          headerTransparent: true,
          headerTitleAlign: "center",
          headerTitleStyle: {
            ...HEADER_TITLE_STYLES,
          },
          headerLeft: ({}) => {
            const handleOnPress = () => {
              navigation.dispatch(DrawerActions.toggleDrawer())
            }

            return <UserAvatar size="sm" onPress={handleOnPress}></UserAvatar>
          },
          headerLeftContainerStyle: { paddingLeft: spacing.medium },
          headerRightContainerStyle: { paddingRight: spacing.medium },
          headerRight: ({}) => {
            const handleOnPress = () => {
              navigation.getParent()?.navigate("SettingsStack")
            }

            return (
              <Icon icon="adjustmentsVertical" colorToken={"text.softer"} onPress={handleOnPress} />
            )
          },
          headerTitle: () => (
            <UserPhone justifyContent={"center"} textProps={{ colorToken: "text" }} />
          ),
          tabBarAccessibilityLabel: translate("navigator.keypad"),
          tabBarLabel: translate("navigator.keypad"),
          tabBarIcon: ({ focused }) => (
            <Icon
              size={8}
              color={focused ? tabIconColorActive : tabIconColorInActive}
              icon="keypad"
              isOutline={true}
            />
          ),
        }}
      />

      <Tab.Screen
        name="ContactsStack"
        component={ContactsStack}
        options={({ route: contactStackRoute }) => {
          return {
            headerShown: false,
            title: "Contacts",
            tabBarAccessibilityLabel: translate("navigator.contactsTab"),
            tabBarLabel: translate("navigator.contactsTab"),
            tabBarIcon: ({ focused }) => (
              <Icon
                size={28}
                color={focused ? tabIconColorActive : tabIconColorInActive}
                icon="contacts"
                isOutline={focused ? false : true}
              />
            ),
          }
        }}
      />
    </Tab.Navigator>
  )
}
