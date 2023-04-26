import { CompositeScreenProps, DrawerActions } from "@react-navigation/native"
import { NativeStackScreenProps, createNativeStackNavigator } from "@react-navigation/native-stack"
import { observer } from "mobx-react-lite"
import { Stack } from "native-base"

import React, { FC } from "react"
import { Icon } from "../../components"
import { UserAvatar } from "../../components/UserAvatar"
import { translate } from "../../i18n"
import { useStores } from "../../models"
import { HomeTabScreenProps } from "../../navigators/HomeTabNavigator"
import { HEADER_TITLE_STYLES } from "../../theme"
import { useColor } from "../../theme/useColor"
import { ContactsScreen } from "./ContactsScreen"

export type ContactsStackParamList = {
  ContactsList: undefined
}

export type ContactsStackScreenProps<T extends keyof ContactsStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<ContactsStackParamList, T>,
  HomeTabScreenProps<"ContactsStack">
>

const StackNavigator = createNativeStackNavigator<ContactsStackParamList>()

export const ContactsStack: FC<HomeTabScreenProps<"ContactsStack">> = observer(
  function ContactsStack(_props) {
    const { navigation } = _props

    const { contactsStore } = useStores()
    const headerLargeBg = useColor("bg.largeHeader")
    const headerBg = useColor("bg.header")

    return (
      <StackNavigator.Navigator>
        <StackNavigator.Screen
          name={"ContactsList"}
          component={ContactsScreen}
          options={{
            headerShown: true,
            headerTitle: translate("navigator.contactsTab"),
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
            headerLeft: contactsStore.isHeaderSearchOpen
              ? null
              : ({}) => {
                  const handleOnPressSettings = () => {
                    navigation.dispatch(DrawerActions.toggleDrawer())
                  }

                  return <UserAvatar size="sm" onPress={handleOnPressSettings}></UserAvatar>
                },

            headerRight: ({}) => {
              const handleOnPress = () => {
                navigation.getParent()?.navigate("SettingsStack")
              }

              return (
                <Stack position="relative">
                  <Icon
                    icon="adjustmentsVertical"
                    colorToken={"text.softer"}
                    onPress={handleOnPress}
                  />
                </Stack>
              )
            },
          }}
        />
      </StackNavigator.Navigator>
    )
  },
)
