import { CompositeScreenProps, DrawerActions } from "@react-navigation/native"
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"

import React, { FC } from "react"
import { Icon } from "../../components"
import { UserAvatar } from "../../components/UserAvatar"
import { translate } from "../../i18n"
import { AppDrawerScreenProps } from "../../navigators"

import { HEADER_TITLE_STYLES } from "../../theme"
import { useColor } from "../../theme/useColor"
import { TemplateGalleryScreen } from "./TemplateGalleryScreen"

export type TemplateGalleryStackParamList = {
  TemplateGallery: undefined
}

export type TemplateGalleryStackScreenProps<T extends keyof TemplateGalleryStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<TemplateGalleryStackParamList, T>,
    AppDrawerScreenProps<"TemplateGalleryStack">
  >

const Stack = createNativeStackNavigator<TemplateGalleryStackParamList>()

export const TemplateGalleryStack: FC<AppDrawerScreenProps<"TemplateGalleryStack">> = (_props) => {
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
        name={"TemplateGallery"}
        component={TemplateGalleryScreen}
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
          headerTitle: translate("navigator.gallery"),
        }}
      />
    </Stack.Navigator>
  )
}
