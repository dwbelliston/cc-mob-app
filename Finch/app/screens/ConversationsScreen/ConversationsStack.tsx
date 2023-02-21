import { DrawerActions, useNavigation } from "@react-navigation/native"
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
import { observer } from "mobx-react-lite"

import { useColorModeValue } from "native-base"
import React, { FC } from "react"
import { ConversationInboxPicker } from "../../components"
import { UserAvatar } from "../../components/UserAvatar"
import { useStores } from "../../models"
import { HomeTabScreenProps } from "../../navigators/HomeTabNavigator"
import { colors } from "../../theme"
import { ConversationDetailScreen } from "./ConversationDetailScreen"
import { InboxScreen } from "./InboxScreen"

export type ConversationsStackParamList = {
  Inbox: undefined
  ConversationDetail: { contactName?: string; conversationId?: string } | undefined
}

export type ConversationStackScreenProps<T extends keyof ConversationsStackParamList> =
  NativeStackScreenProps<ConversationsStackParamList, T>

const Stack = createNativeStackNavigator<ConversationsStackParamList>()

export const ConversationsStack: FC<HomeTabScreenProps<"ConversationsStack">> = observer(
  function ConversationsStack(_props) {
    const { navigation } = _props
    const { conversationStore } = useStores()

    const headerBg = useColorModeValue("white", colors.gray[900])
    const headerDetailBg = useColorModeValue(colors.primary[700], colors.gray[900])

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
              backgroundColor: headerBg,
            },
            headerLeft: conversationStore.isHeaderSearchOpen
              ? null
              : ({}) => {
                  const navigation = useNavigation()
                  const handleOnPressSettings = () => {
                    navigation.dispatch(DrawerActions.toggleDrawer())
                  }

                  return <UserAvatar size="sm" onPress={handleOnPressSettings}></UserAvatar>
                },
            headerRight: () => <ConversationInboxPicker />,
          }}
        />
        <Stack.Screen
          name={"ConversationDetail"}
          component={ConversationDetailScreen}
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
  },
)
