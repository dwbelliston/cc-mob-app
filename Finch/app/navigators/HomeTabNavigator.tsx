import { BottomTabScreenProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { CompositeScreenProps, DrawerActions } from "@react-navigation/native"

import { Box, IconButton, useColorModeValue } from "native-base"
import React, { FC } from "react"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Icon, Text } from "../components"

import { useNavigation } from "@react-navigation/native"
import { translate } from "../i18n"

import { ContactsStack } from "../screens/ContactsScreen/ContactsStack"
import { ConversationsStack } from "../screens/ConversationsScreen/ConversationsStack"
import useGetCountUnreadConversations from "../services/api/conversations/queries/useGetCountUnreadConversations"
import { colors, spacing } from "../theme"
import { useColor } from "../theme/useColor"
import { AppHomeScreenProps } from "./AppHomeNavigator"

export type HomeTabParamList = {
  ConversationsStack: undefined
  ContactsStack: undefined
}

/**
 * Helper for automatically generating navigation prop types for each route.
 *
 * More info: https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type HomeTabScreenProps<T extends keyof HomeTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<HomeTabParamList, T>,
  AppHomeScreenProps<"Home">
>

const Tab = createBottomTabNavigator<HomeTabParamList>()

export const HomeTabNavigator: FC<AppHomeScreenProps<"Home">> = (_props) => {
  const { route } = _props

  const { bottom } = useSafeAreaInsets()

  const { data: dataCountUnreadConversations } = useGetCountUnreadConversations()

  const unreadCountBadge = dataCountUnreadConversations

  // const tabBg = useColorModeValue(colors.gray[50], colors.gray[900])
  const tabBorder = useColorModeValue(colors.gray[100], colors.gray[800])

  const tabIconColorActive = useColorModeValue(colors.primary[600], colors.primary[200])
  const tabIconColorInActive = useColorModeValue(colors.gray[400], colors.gray[600])

  const tabBg = useColor("bg.main")
  const headerBg = useColor("bg.main")

  // const hide = route.name != "Profile"

  return (
    <Tab.Navigator
      id="HomeTabNavigator"
      screenOptions={{
        headerShown: false,
        headerLeftContainerStyle: { paddingLeft: spacing.large },
        headerTitleContainerStyle: { width: "100%" },
        headerBackgroundContainerStyle: {
          borderBottomWidth: 2,
          borderBottomColor: tabBorder,
          backgroundColor: headerBg,
          height: bottom + 80,
        },
        headerRightContainerStyle: { paddingRight: spacing.large },
        headerTransparent: true,
        headerTitleAlign: "center",

        headerTitle: ({ children }) => {
          return (
            <Box w="full">
              <Text
                textAlign={"center"}
                colorToken="text.soft"
                preset="heading"
                fontSize="lg"
                text={children}
              />
            </Box>
          )
        },
        headerLeft: (props) => {
          const navigation = useNavigation()
          return (
            <IconButton
              colorScheme={"gray"}
              onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
              icon={<Icon colorToken="text.softer" icon="menu" size={32} />}
            ></IconButton>
          )
        },
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: tabIconColorActive,
        tabBarInactiveTintColor: tabIconColorInActive,
        tabBarStyle: {
          borderTopWidth: 2,
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
          top: 2,
        },
      }}
    >
      <Tab.Screen
        name="ConversationsStack"
        component={ConversationsStack}
        options={{
          headerShown: false,
          title: "Inbox",
          tabBarAccessibilityLabel: translate("navigator.inboxTab"),
          tabBarLabel: translate("navigator.inboxTab"),
          tabBarBadge: unreadCountBadge,
          tabBarIcon: ({ focused }) => (
            <Icon
              size={32}
              color={focused ? tabIconColorActive : tabIconColorInActive}
              icon="chat"
              isOutline={focused ? false : true}
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
            title: "Inbox",
            tabBarAccessibilityLabel: translate("navigator.contactsTab"),
            tabBarLabel: translate("navigator.contactsTab"),
            tabBarIcon: ({ focused }) => (
              <Icon
                size={32}
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
