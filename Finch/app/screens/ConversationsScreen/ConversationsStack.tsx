import { DrawerActions } from "@react-navigation/native"
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
import { observer } from "mobx-react-lite"

import React, { FC } from "react"
import { ConversationInboxPicker } from "../../components"
import { UserAvatar } from "../../components/UserAvatar"
import { useStores } from "../../models"
import { HomeTabScreenProps } from "../../navigators/HomeTabNavigator"
import { HEADER_TITLE_STYLES } from "../../theme"
import { useColor } from "../../theme/useColor"
import { InboxScreen } from "./InboxScreen"

export type ConversationsStackParamList = {
  Inbox: undefined
}

export type ConversationStackScreenProps<T extends keyof ConversationsStackParamList> =
  NativeStackScreenProps<ConversationsStackParamList, T>

const Stack = createNativeStackNavigator<ConversationsStackParamList>()

export const ConversationsStack: FC<HomeTabScreenProps<"ConversationsStack">> = observer(
  function ConversationsStack(_props) {
    const { navigation } = _props
    const { conversationStore } = useStores()

    const headerLargeBg = useColor("bg.largeHeader")

    return (
      <Stack.Navigator>
        <Stack.Screen
          name={"Inbox"}
          component={InboxScreen}
          options={{
            headerTitle: conversationStore.inboxViewTx,
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
            headerLeft: conversationStore.isHeaderSearchOpen
              ? null
              : ({}) => {
                  const handleOnPressSettings = () => {
                    navigation.dispatch(DrawerActions.toggleDrawer())
                  }

                  return <UserAvatar size="sm" onPress={handleOnPressSettings}></UserAvatar>
                },
            headerRight: () => <ConversationInboxPicker />,
          }}
        />
      </Stack.Navigator>
    )
  },
)
