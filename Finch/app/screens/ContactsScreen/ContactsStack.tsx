import { DrawerActions, useNavigation } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"

import { useColorModeValue } from "native-base"
import React from "react"
import { UserAvatar } from "../../components/UserAvatar"
import { colors } from "../../theme"
import { ContactsScreen } from "./ContactsScreen"

const Stack = createNativeStackNavigator()

export const WrappedContactsScreen = () => {
  const headerBg = useColorModeValue("white", colors.gray[900])

  return (
    <Stack.Navigator>
      <Stack.Screen
        name={"Contacts"}
        component={ContactsScreen}
        options={{
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
