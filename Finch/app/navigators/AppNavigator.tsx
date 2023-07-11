/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native"
import { NativeStackScreenProps, createNativeStackNavigator } from "@react-navigation/native-stack"
import { observer } from "mobx-react-lite"
import { useColorModeValue } from "native-base"
import React from "react"
import { useColorScheme } from "react-native"
import Config from "../config"
import { translate } from "../i18n"
import { useStores } from "../models"
import {
  AltLoginScreen,
  ContactDetailScreen,
  ConversationStreamScreen,
  LoginScreen,
  ResetPasswordScreen,
  WelcomeScreen,
} from "../screens"
import { BroadcastDetailScreen } from "../screens/BroadcastsScreen/BroadcastDetailScreen"
import { AddContactScreen } from "../screens/ContactsScreen/AddContactScreen"
import { ConversationSteamDetailMenu } from "../screens/ConversationsScreen/ConversationSteamDetailMenu"
import { NewMessageScreen } from "../screens/ConversationsScreen/NewMessageScreen"
import { ResetPasswordConfirmScreen } from "../screens/ResetPasswordConfirmScreen"
import { HEADER_TITLE_STYLES, colors } from "../theme"
import { useColor } from "../theme/useColor"
import { runFormatPhoneSimple } from "../utils/useFormatPhone"
import AppDrawerNavigator from "./AppDrawerNavigator"

import { VerifyLoginScreen } from "../screens/VerifyLoginScreen"
import { navigationRef, useBackButtonHandler } from "./navigationUtilities"

const imgSrc = require("../../assets/images/img-lines-header-light.png")

/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * If no params are allowed, pass through `undefined`. Generally speaking, we
 * recommend using your MobX-State-Tree store(s) to keep application state
 * rather than passing state through navigation params.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 *   https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type AppStackParamList = {
  Welcome: undefined
  AppDrawer: undefined
  ConversationStream:
    | {
        contactName?: string
        conversationId?: string
        conversationNumber?: string
        contactId?: string
      }
    | undefined
  ContactDetail: { contactName: string; contactId: string } | undefined
  BroadcastDetail: { title: string; broadcastId: string } | undefined
  NewMessage: undefined
  AddContact: { contactPhone?: string; assignConversationId?: string } | undefined
  Login: { username?: string; password?: string } | undefined
  AltLogin: undefined
  VerifyLogin: undefined
  ResetPassword: { email?: string } | undefined
  ResetPasswordConfirm: { email?: string } | undefined
}

/**
 * This is a list of all the route names that will exit the app if the back button
 * is pressed while in that screen. Only affects Android.
 */
const exitRoutes = Config.exitRoutes

export type AppStackScreenProps<T extends keyof AppStackParamList> = NativeStackScreenProps<
  AppStackParamList,
  T
>

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createNativeStackNavigator<AppStackParamList>()

const AppStack = observer(function AppStack() {
  const {
    authenticationStore: { isAuthenticated },
  } = useStores()

  const headerDetailBg = useColor("bg.header")

  const headerDetailNewBg = useColorModeValue(colors.primary[50], colors.primary[800])
  const headerDetailNewColor = useColorModeValue(colors.primary[600], colors.primary[100])
  const contactBgColor = useColorModeValue(colors.primary[600], colors.primary[600])

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={isAuthenticated ? "AppDrawer" : "Login"}
    >
      {isAuthenticated ? (
        <Stack.Group>
          <Stack.Screen name="AppDrawer" component={AppDrawerNavigator} />
          <Stack.Screen
            name={"ConversationStream"}
            component={ConversationStreamScreen}
            options={({ route }) => ({
              headerShown: true,
              headerTitle:
                route.params?.contactName ||
                runFormatPhoneSimple(route.params?.conversationNumber) ||
                "Conversation",
              // headerLargeTitle: true,
              headerStyle: {
                backgroundColor: headerDetailBg,
              },
              headerTitleStyle: {
                ...HEADER_TITLE_STYLES,
              },
              headerBackVisible: true,
              headerRight: () => (
                <ConversationSteamDetailMenu
                  contactId={route.params.contactId}
                  contactName={route.params.contactName}
                  conversationNumber={route.params.conversationNumber}
                  conversationId={route.params.conversationId}
                />
              ),
            })}
          />

          <Stack.Screen
            name={"ContactDetail"}
            component={ContactDetailScreen}
            options={({ route }) => ({
              headerShown: false,
              headerTitle: route.params?.contactName || "Contact",
              // headerLargeTitle: true,
              headerStyle: {
                backgroundColor: contactBgColor,
              },
              headerTitleStyle: {
                color: "white",
                ...HEADER_TITLE_STYLES,
              },
              headerBackVisible: true,
            })}
          />
          <Stack.Screen
            name={"BroadcastDetail"}
            component={BroadcastDetailScreen}
            options={({ route }) => ({
              headerShown: false,
              headerTitle: route.params?.title || "Broadcast",
              // headerLargeTitle: true,
              headerStyle: {
                backgroundColor: contactBgColor,
              },
              headerTitleStyle: {
                color: "white",
                ...HEADER_TITLE_STYLES,
              },
              headerBackVisible: true,
            })}
          />

          <Stack.Screen
            name={"AddContact"}
            component={AddContactScreen}
            options={({ route }) => ({
              headerShown: true,
              headerTitle: translate("contacts.newContact"),
              headerStyle: {
                backgroundColor: headerDetailNewBg,
              },
              headerTitleStyle: {
                color: headerDetailNewColor,
                ...HEADER_TITLE_STYLES,
              },
              headerBackVisible: true,
            })}
          />
          <Stack.Screen
            name={"NewMessage"}
            component={NewMessageScreen}
            options={({ route }) => ({
              headerShown: true,
              headerTitle: translate("inbox.newMessage"),
              headerStyle: {
                backgroundColor: headerDetailNewBg,
              },
              headerTitleStyle: {
                color: headerDetailNewColor,
                ...HEADER_TITLE_STYLES,
              },
              headerBackVisible: true,
            })}
          />
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
        </Stack.Group>
      ) : (
        <Stack.Group>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="AltLogin" component={AltLoginScreen} />
          <Stack.Screen name="VerifyLogin" component={VerifyLoginScreen} />
          <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
          <Stack.Screen name="ResetPasswordConfirm" component={ResetPasswordConfirmScreen} />
        </Stack.Group>
      )}
    </Stack.Navigator>
  )
})

interface NavigationProps extends Partial<React.ComponentProps<typeof NavigationContainer>> {}

export const AppNavigator = observer(function AppNavigator(props: NavigationProps) {
  const colorScheme = useColorScheme()

  useBackButtonHandler((routeName) => exitRoutes.includes(routeName))

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      {...props}
    >
      <AppStack />
    </NavigationContainer>
  )
})
