import { BottomTabScreenProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { CompositeScreenProps, DrawerActions } from "@react-navigation/native"

import { Box, IconButton, useColorModeValue } from "native-base"
import React from "react"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Icon, Text } from "../components"

import { useNavigation } from "@react-navigation/native"
import { translate } from "../i18n"

import { ConversationStatusEnum, useGetCountMessages } from "../models/Conversation"
import { SettingsScreen } from "../screens"
import { WrappedContactsScreen } from "../screens/ContactsScreen/ContactsStack"
import { WrappedInboxScreen } from "../screens/ConversationsScreen/ConversationsStack"
import useListConversations from "../services/api/conversations/queries/useListConversations"
import { colors, spacing } from "../theme"
import { useColor } from "../theme/useColor"
import { AppStackParamList, AppStackScreenProps } from "./AppNavigator"

export type HomeTabParamList = {
  Dashboard: undefined
  InboxTab: undefined
  ContactsTab: undefined
  Settings: undefined
}

/**
 * Helper for automatically generating navigation prop types for each route.
 *
 * More info: https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type HomeTabScreenProps<T extends keyof HomeTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<HomeTabParamList, T>,
  AppStackScreenProps<keyof AppStackParamList>
>

const Tab = createBottomTabNavigator<HomeTabParamList>()

export const HomeTabNavigator = () => {
  const [viewLimit] = React.useState(25)
  const { bottom } = useSafeAreaInsets()

  const { data: dataUnreadConversations } = useListConversations({
    pageLimit: viewLimit,
    search: null,
    isUnread: true,
    fromFolderId: null,
    conversationStatus: ConversationStatusEnum.OPEN,
  })

  const unreadCountBadge = useGetCountMessages(viewLimit, dataUnreadConversations)

  const tabBg = useColorModeValue(colors.white, colors.gray[900])
  const tabBorder = useColorModeValue(colors.gray[50], colors.gray[700])
  const tabIconBgActive = useColorModeValue(colors.primary[600], colors.gray[800])
  const tabIconColorActive = useColorModeValue(colors.primary[600], colors.primary[200])
  const tabIconColorInActive = useColorModeValue(colors.gray[400], colors.gray[600])
  const tabLabelColorInActive = useColorModeValue(colors.gray[300], colors.gray[600])

  const headerBg = useColor("bg.main")

  return (
    <Tab.Navigator
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
        // headerBackground: () => (
        //   <BlurView
        //     tint={tintColor}
        //     intensity={80}
        //     style={StyleSheet.absoluteFill}
        //   />
        // ),
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
          paddingTop: 0,
          // borderTopColor: "red",
          borderTopColor: tabBorder,
          backgroundColor: tabBg,
          height: bottom + 60,
        },

        // tabBarLabelPosition: "below-icon",
        tabBarItemStyle: {
          // paddingTop: spacing.medium,
        },
        tabBarIconStyle: {
          flex: 1,
        },
        // tabBarLabelStyle: {
        //   fontSize: 8,
        //   fontWeight: "600",
        //   lineHeight: 16,
        //   flex: 1,
        //   paddingTop: 8,
        //   color: tabLabelColorInActive,
        // },
        tabBarBadgeStyle: {
          top: -14,
        },
        // tabBarItemStyle: {},
      }}
    >
      <Tab.Screen
        name="InboxTab"
        component={WrappedInboxScreen}
        options={{
          headerShown: false,
          title: "Inbox",
          tabBarAccessibilityLabel: translate("navigator.inboxTab"),
          tabBarLabel: translate("navigator.inboxTab"),
          tabBarIcon: ({ focused }) => (
            <Icon
              size={32}
              color={focused ? tabIconColorActive : tabIconColorInActive}
              icon="chat"
              // isOutline={focused ? false : true}
            />
          ),
        }}
      />

      <Tab.Screen
        name="ContactsTab"
        component={WrappedContactsScreen}
        options={{
          headerShown: false,
          title: "Inbox",
          tabBarAccessibilityLabel: translate("navigator.contactsTab"),
          tabBarLabel: translate("navigator.contactsTab"),
          tabBarIcon: ({ focused }) => (
            <Icon
              size={32}
              color={focused ? tabIconColorActive : tabIconColorInActive}
              icon="contacts"
              // isOutline={focused ? false : true}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerShown: true,
          tabBarAccessibilityLabel: translate("navigator.settings"),
          tabBarLabel: translate("navigator.settings"),
          tabBarIcon: ({ focused }) => (
            // <Circle
            //   bg={focused ? tabIconBgActive : tabBg}
            //   p={1}
            //   h={12}
            //   w={12}
            //   borderRadius={"full"}
            // >
            <Icon
              size={32}
              color={focused ? tabIconColorActive : tabIconColorInActive}
              // isOutline={focused ? false : true}
              icon="settings"
            />
            // </Circle>
          ),
        }}
      />
    </Tab.Navigator>
  )
}

//  <Tab.Screen
//   name="Dashboard"
//   component={DashboardScreen}
//   options={{
//     tabBarLabel: translate("navigator.AppTab"),
//     tabBarIcon: ({ focused }) => (
//       <Circle
//         bg={focused ? tabIconBgActive : tabBg}
//         p={1}
//         h={10}
//         w={10}
//         borderRadius={8}
//       >
//         <Icon
//           color={focused ? tabIconColorActive : tabIconColorInActive}

//           as={<MaterialIcons name="home" />}
//         />
//       </Circle>
//     ),
//   }}
// />
