/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
import { observer } from "mobx-react-lite"
import { useColorModeValue } from "native-base"
import React from "react"
import { useColorScheme } from "react-native"
import Config from "../config"
import { useStores } from "../models"
import {
  AltLoginScreen,
  ContactDetailScreen,
  ConversationStreamScreen,
  LoginScreen,
  ResetPasswordScreen,
  WelcomeScreen,
} from "../screens"
import { ResetPasswordConfirmScreen } from "../screens/ResetPasswordConfirmScreen"
import { colors, HEADER_TITLE_STYLES } from "../theme"
import { useColor } from "../theme/useColor"
import AppDrawerNavigator from "./AppDrawerNavigator"

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
  ConversationStream: { contactName?: string; conversationId?: string } | undefined
  ContactDetail: { contactName: string; contactId: string } | undefined
  Login: { username?: string; password?: string } | undefined
  AltLogin: undefined
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

  const headerLargeBg = useColor("bg.largeHeader")
  const headerDetailBg = useColor("bg.header")
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
              headerTitle: route.params?.contactName || "Conversation",
              // headerLargeTitle: true,
              headerStyle: {
                backgroundColor: headerDetailBg,
              },
              headerTitleStyle: {
                ...HEADER_TITLE_STYLES,
              },
              headerBackVisible: true,
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
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
        </Stack.Group>
      ) : (
        <Stack.Group>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="AltLogin" component={AltLoginScreen} />
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
