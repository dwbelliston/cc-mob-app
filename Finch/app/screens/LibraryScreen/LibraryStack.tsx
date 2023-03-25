import { CompositeScreenProps, DrawerActions } from "@react-navigation/native"
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"

import React, { FC } from "react"
import { Icon } from "../../components"
import { UserAvatar } from "../../components/UserAvatar"
import { translate } from "../../i18n"
import { AppDrawerScreenProps } from "../../navigators"

import { HEADER_TITLE_STYLES } from "../../theme"
import { useColor } from "../../theme/useColor"
import { LibraryScreen } from "./LibraryScreen"
import { SmsTemplatesScreen } from "./smstemplates/SmsTemplatesScreen"
import { TemplateGalleryScreen } from "./TemplateGalleryScreen"

export type LibraryStackParamList = {
  Library: undefined
  TemplateGallery: undefined
  SmsTemplates: undefined
}

export type LibraryStackScreenProps<T extends keyof LibraryStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<LibraryStackParamList, T>,
  AppDrawerScreenProps<"LibraryStack">
>

const Stack = createNativeStackNavigator<LibraryStackParamList>()

export const LibraryStack: FC<AppDrawerScreenProps<"LibraryStack">> = (_props) => {
  const { navigation } = _props

  const headerLargeBg = useColor("bg.largeHeader")
  const headerBg = useColor("bg.header")

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
      }}
    >
      <Stack.Screen
        name={"Library"}
        component={LibraryScreen}
        options={{
          headerStyle: {
            backgroundColor: headerBg,
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
          headerTitle: translate("navigator.library"),
        }}
      />

      <Stack.Screen
        name={"TemplateGallery"}
        component={TemplateGalleryScreen}
        options={{
          headerTitle: translate("library.templateGallery"),
          headerStyle: {
            backgroundColor: headerBg,
          },
        }}
      />
      <Stack.Screen
        name={"SmsTemplates"}
        component={SmsTemplatesScreen}
        options={{
          headerTitle: translate("library.smsTemplates"),
          headerStyle: {
            backgroundColor: headerBg,
          },
        }}
      />
    </Stack.Navigator>
  )
}
