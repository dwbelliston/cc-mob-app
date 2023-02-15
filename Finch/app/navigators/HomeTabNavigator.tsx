import { BottomTabScreenProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { CompositeScreenProps, DrawerActions } from "@react-navigation/native"

import { Circle, IconButton, useColorModeValue } from "native-base"
import React from "react"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Icon, Text } from "../components"

import { useNavigation } from "@react-navigation/native"
import { translate } from "../i18n"

import { ContactsScreen, ConversationsScreen, SettingsScreen } from "../screens"
import { colors, spacing } from "../theme"
import { AppStackParamList, AppStackScreenProps } from "./AppNavigator"

export type HomeTabParamList = {
  Dashboard: undefined
  Inbox: undefined
  Contacts: undefined
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
  const { bottom } = useSafeAreaInsets()

  const tabBg = useColorModeValue(colors.white, colors.gray[900])

  // const tabBorder = useColor("border.soft");
  const tabBorder = useColorModeValue(colors.gray[100], colors.gray[800])

  const tabIconColorActive = useColorModeValue(colors.primary[600], colors.white)

  const tabIconBgActive = useColorModeValue(colors.gray[50], colors.secondary[400])

  const tabIconColorInActive = useColorModeValue(colors.gray[500], colors.gray[600])

  const tintColor = useColorModeValue("light", "dark")

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        headerTitleStyle: { paddingBottom: "4px" },
        headerStyle: {
          height: 120,
        },
        headerLeftContainerStyle: { paddingLeft: spacing.large },
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
          return <Text preset="heading" fontSize="lg" text={children} />
        },

        headerLeft: (props) => {
          const navigation = useNavigation()
          return (
            <IconButton
              onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
              icon={<Icon colorToken="text.softer" icon="menu" size={32} />}
            ></IconButton>
          )
        },
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: tabIconColorActive,
        tabBarInactiveTintColor: tabIconColorInActive,
        tabBarStyle: {
          borderTopWidth: 1,
          paddingTop: 8,
          borderTopColor: tabBorder,
          backgroundColor: tabBg,
          height: bottom + 80,
        },
        tabBarLabelPosition: "below-icon",
        tabBarItemStyle: {
          paddingTop: spacing.medium,
        },
        tabBarIconStyle: {
          flex: 1,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
          lineHeight: 16,
          flex: 1,
          paddingTop: 8,
        },
        // tabBarItemStyle: {},
      }}
    >
      <Tab.Screen
        name="Inbox"
        component={ConversationsScreen}
        options={{
          headerShown: true,
          title: "Conversations",

          tabBarLabel: translate("navigator.inboxTab"),
          tabBarIcon: ({ focused }) => (
            <Circle bg={focused ? tabIconBgActive : tabBg} p={1} h={10} w={10} borderRadius={8}>
              <Icon
                color={focused ? tabIconColorActive : tabIconColorInActive}
                icon="chat"
                isOutline={focused ? false : true}
              />
            </Circle>
          ),
        }}
      />
      {/* <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: translate("navigator.AppTab"),
          tabBarIcon: ({ focused }) => (
            <Circle
              bg={focused ? tabIconBgActive : tabBg}
              p={1}
              h={10}
              w={10}
              borderRadius={8}
            >
              <Icon
                color={focused ? tabIconColorActive : tabIconColorInActive}

                as={<MaterialIcons name="home" />}
              />
            </Circle>
          ),
        }}
      /> */}

      <Tab.Screen
        name="Contacts"
        component={ContactsScreen}
        options={{
          headerShown: true,
          title: "Contacts",
          tabBarLabel: translate("navigator.contactsTab"),
          tabBarIcon: ({ focused }) => (
            <Circle bg={focused ? tabIconBgActive : tabBg} p={1} h={10} w={10} borderRadius={8}>
              <Icon
                color={focused ? tabIconColorActive : tabIconColorInActive}
                isOutline={focused ? false : true}
                icon="contacts"
              />
            </Circle>
          ),
        }}
      />

      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerShown: true,
          tabBarLabel: translate("navigator.settings"),
          tabBarIcon: ({ focused }) => (
            <Circle bg={focused ? tabIconBgActive : tabBg} p={1} h={10} w={10} borderRadius={8}>
              <Icon
                color={focused ? tabIconColorActive : tabIconColorInActive}
                isOutline={focused ? false : true}
                icon="settings"
              />
            </Circle>
          ),
        }}
      />
    </Tab.Navigator>
  )
}
