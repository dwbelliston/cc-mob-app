import { CompositeScreenProps, DrawerActions } from "@react-navigation/native"
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
import { observer } from "mobx-react-lite"

import React, { FC } from "react"
import { UserAvatar } from "../../components/UserAvatar"
import { useStores } from "../../models"
import { AppDrawerScreenProps } from "../../navigators"

import { HEADER_TITLE_STYLES } from "../../theme"
import { useColor } from "../../theme/useColor"
import { BroadcastsListScreen } from "./BroadcastsListScreen"
import { BroadcastStatusPicker } from "./BroadcastStatusPicker"

export type BroadcastsStackParamList = {
  BroadcastsList: undefined
}

export type BroadcastsStackScreenProps<T extends keyof BroadcastsStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<BroadcastsStackParamList, T>,
    AppDrawerScreenProps<"BroadcastsStack">
  >

const Stack = createNativeStackNavigator<BroadcastsStackParamList>()

export const BroadcastsStack: FC<AppDrawerScreenProps<"BroadcastsStack">> = observer(
  function ConversationsStack(_props) {
    const { navigation } = _props

    const { broadcastsStore } = useStores()
    const headerLargeBg = useColor("bg.largeHeader")
    const headerBg = useColor("bg.header")

    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
        }}
      >
        <Stack.Screen
          name={"BroadcastsList"}
          component={BroadcastsListScreen}
          options={{
            headerShown: true,
            headerTitle: broadcastsStore.listviewText,
            headerLargeTitle: true,
            headerLargeTitleShadowVisible: false,
            headerLargeStyle: {
              backgroundColor: headerLargeBg,
            },
            headerStyle: {
              backgroundColor: headerLargeBg,
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
            headerRight: () => <BroadcastStatusPicker />,
          }}
        />
      </Stack.Navigator>
    )
  },
)
