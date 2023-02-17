import { DrawerActions, useNavigation } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"

import { useColorModeValue } from "native-base"
import React from "react"
import { ConversationInboxPicker } from "../../components"
import { UserAvatar } from "../../components/UserAvatar"
import { useStores } from "../../models"
import { colors } from "../../theme"
import { ConversationsScreen } from "./ConversationsScreen"

const Stack = createNativeStackNavigator()

export const WrappedInboxScreen = () => {
  const { conversationStore } = useStores()

  const headerBg = useColorModeValue("white", colors.gray[900])

  return (
    <Stack.Navigator>
      <Stack.Screen
        name={"Inbox"}
        component={ConversationsScreen}
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
}
