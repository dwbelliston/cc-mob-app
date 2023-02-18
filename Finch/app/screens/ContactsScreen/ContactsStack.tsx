import { DrawerActions, useNavigation } from "@react-navigation/native"
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"

import { useColorModeValue } from "native-base"
import React, { FC } from "react"
import { UserAvatar } from "../../components/UserAvatar"
import { HomeTabScreenProps } from "../../navigators/HomeTabNavigator"
import { colors } from "../../theme"
import { ContactsScreen } from "./ContactsScreen"

export type ContactsStackParamList = {
  ContactsList: undefined
  ContactDetail: { contactId: string } | undefined
}

export type ContactsStackScreenProps<T extends keyof ContactsStackParamList> =
  NativeStackScreenProps<ContactsStackParamList, T>

const Stack = createNativeStackNavigator<ContactsStackParamList>()

export const ContactsStack: FC<HomeTabScreenProps<"ContactsStack">> = () => {
  const headerBg = useColorModeValue("white", colors.gray[900])

  return (
    <Stack.Navigator>
      <Stack.Screen
        name={"ContactsList"}
        component={ContactsScreen}
        options={{
          headerTitle: "Contacts",
          headerLargeTitle: true,
          headerLargeTitleShadowVisible: false,
          headerLargeStyle: {
            backgroundColor: headerBg,
          },
          headerLeft: ({}) => {
            const navigation = useNavigation()
            const handleOnPressSettings = () => {
              navigation.dispatch(DrawerActions.toggleDrawer())
            }

            return <UserAvatar size="sm" onPress={handleOnPressSettings}></UserAvatar>
          },
        }}
      />
    </Stack.Navigator>
  )
}
