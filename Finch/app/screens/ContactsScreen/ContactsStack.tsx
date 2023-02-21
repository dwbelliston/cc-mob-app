import { DrawerActions, useNavigation } from "@react-navigation/native"
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"

import { useColorModeValue } from "native-base"
import React, { FC } from "react"
import { UserAvatar } from "../../components/UserAvatar"
import { translate } from "../../i18n"
import { useStores } from "../../models"
import { HomeTabScreenProps } from "../../navigators/HomeTabNavigator"
import { colors } from "../../theme"
import { ContactDetailScreen } from "./ContactDetailScreen"
import { ContactsScreen } from "./ContactsScreen"

export type ContactsStackParamList = {
  ContactsList: undefined
  ContactDetail: { contactName?: string; contactId?: string } | undefined
}

export type ContactsStackScreenProps<T extends keyof ContactsStackParamList> =
  NativeStackScreenProps<ContactsStackParamList, T>

const Stack = createNativeStackNavigator<ContactsStackParamList>()

export const ContactsStack: FC<HomeTabScreenProps<"ContactsStack">> = (_props) => {
  const { navigation } = _props

  const { contactsStore } = useStores()
  const headerBg = useColorModeValue("white", colors.gray[900])

  const headerDetailBg = useColorModeValue(colors.primary[700], colors.primary[900])

  return (
    <Stack.Navigator>
      <Stack.Screen
        name={"ContactsList"}
        component={ContactsScreen}
        options={{
          headerTitle: translate("navigator.contactsTab"),
          headerLargeTitle: true,
          headerLargeTitleShadowVisible: false,
          headerLargeStyle: {
            backgroundColor: headerBg,
          },
          headerLeft: contactsStore.isHeaderSearchOpen
            ? null
            : ({}) => {
                const navigation = useNavigation()
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
          headerTitle: route.params?.contactName,
          // headerLargeTitle: true,
          headerStyle: {
            backgroundColor: headerDetailBg,
          },
          headerTitleStyle: {
            color: "white",
          },
          headerBackVisible: true,
        })}
      />
    </Stack.Navigator>
  )
}
