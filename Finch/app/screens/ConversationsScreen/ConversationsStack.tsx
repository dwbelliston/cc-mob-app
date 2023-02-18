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
import { InboxScreen } from "./InboxScreen"

export type ConversationsStackParamList = {
  Inbox: undefined
  ConversationDetail: { username?: string; password?: string } | undefined
}

export type ConversationStackScreenProps<T extends keyof ConversationsStackParamList> =
  NativeStackScreenProps<ConversationsStackParamList, T>

const Stack = createNativeStackNavigator<ConversationsStackParamList>()

export const ConversationsStack: FC<HomeTabScreenProps<"ConversationsStack">> = observer(
  function ConversationsStack(_props) {
    const { conversationStore } = useStores()

    const headerBg = useColorModeValue("white", colors.gray[900])

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
            headerLeft: ({}) => {
              const navigation = useNavigation()
              const handleOnPressSettings = () => {
                navigation.dispatch(DrawerActions.toggleDrawer())
              }

              return <UserAvatar size="sm" onPress={handleOnPressSettings}></UserAvatar>
            },
            headerRight: () => <ConversationInboxPicker />,
            // header: ({ navigation, options }) => {

            //   return (
            //     <HStack
            //       py={spacing.micro}
            //       px={spacing.tiny}
            //       alignItems={"center"}
            //       justifyContent="space-between"
            //     >
            //       <HStack space={spacing.tiny} alignItems={"center"}>

            //         <Text colorToken="text" preset="heading" tx="common.inbox" />
            //       </HStack>
            //       <Icon icon="menu"></Icon>
            //     </HStack>
            //   )
            // },
          }}
        />
      </Stack.Navigator>
    )
  },
)
