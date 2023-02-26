import { CompositeScreenProps, DrawerActions } from "@react-navigation/native"
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"

import React, { FC } from "react"
import { UserAvatar } from "../../components/UserAvatar"
import { translate } from "../../i18n"
import { useStores } from "../../models"
import { HomeTabScreenProps } from "../../navigators/HomeTabNavigator"
import { useColor } from "../../theme/useColor"
import { ContactDetailScreen } from "./ContactDetailScreen"
import { ContactsScreen } from "./ContactsScreen"

export type ContactsStackParamList = {
  ContactsList: undefined
  ContactDetail: { contactName: string; contactId: string; contactColor: string } | undefined
}

export type ContactsStackScreenProps<T extends keyof ContactsStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<ContactsStackParamList, T>,
  HomeTabScreenProps<"ContactsStack">
>

const Stack = createNativeStackNavigator<ContactsStackParamList>()

export const ContactsStack: FC<HomeTabScreenProps<"ContactsStack">> = (_props) => {
  const { navigation } = _props

  const { contactsStore } = useStores()
  const headerLargeBg = useColor("bg.largeHeader")
  const headerBg = useColor("bg.header")

  return (
    <Stack.Navigator>
      <Stack.Screen
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
          headerLeft: contactsStore.isHeaderSearchOpen
            ? null
            : ({}) => {
                const handleOnPressSettings = () => {
                  navigation.dispatch(DrawerActions.toggleDrawer())
                }

                return <UserAvatar size="sm" onPress={handleOnPressSettings}></UserAvatar>
              },
        }}
      />

      <Stack.Screen
        name={"ContactDetail"}
        component={ContactDetailScreen}
        options={({ route }) => ({
          headerShown: false,
          headerTitle: "Contact",
          headerBackVisible: true,
          headerStyle: {
            // backgroundColor: headerBg,
            backgroundColor: route.params.contactColor,
          },
        })}
      />
    </Stack.Navigator>
  )
}
