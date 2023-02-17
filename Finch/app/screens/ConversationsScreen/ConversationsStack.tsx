import { DrawerActions, useNavigation } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"

import { Box, HStack, IconButton, Menu, useColorModeValue } from "native-base"
import React from "react"
import { Icon, Text } from "../../components"
import { UserAvatar } from "../../components/UserAvatar"
import { colors, spacing } from "../../theme"
import { ConversationsScreen } from "./ConversationsScreen"

const Stack = createNativeStackNavigator()

export const WrappedInboxScreen = () => {
  const headerBg = useColorModeValue("white", colors.gray[900])

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Inbox"
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
          headerRight: ({}) => {
            const handleOnUnread = () => {
              // navigation.dispatch(DrawerActions.toggleDrawer())
            }

            const handleOnActive = () => {
              // navigation.dispatch(DrawerActions.toggleDrawer())
            }

            const handleOnClosed = () => {
              // navigation.dispatch(DrawerActions.toggleDrawer())
            }

            return (
              <Box position="relative">
                <Menu
                  w="48"
                  trigger={(triggerProps) => {
                    return (
                      <IconButton
                        colorScheme={"gray"}
                        accessibilityLabel="More options menu"
                        icon={<Icon icon="inbox"></Icon>}
                        {...triggerProps}
                      ></IconButton>
                    )
                  }}
                >
                  <Menu.Item onPress={handleOnUnread}>
                    <HStack space={spacing.tiny} alignItems="center">
                      <Icon size={16} colorToken={"text"} icon="inbox"></Icon>
                      <Text colorToken={"text"} tx="inbox.unread"></Text>
                    </HStack>
                  </Menu.Item>
                  <Menu.Item onPress={handleOnActive}>
                    <HStack space={spacing.tiny} alignItems="center">
                      <Icon size={16} colorToken={"text"} icon="chat"></Icon>
                      <Text colorToken={"text"} tx="inbox.active"></Text>
                    </HStack>
                  </Menu.Item>
                  <Menu.Item onPress={handleOnClosed}>
                    <HStack space={spacing.tiny} alignItems="center">
                      <Icon size={16} colorToken={"text"} icon="checkCircle"></Icon>
                      <Text colorToken={"text"} tx="inbox.closed"></Text>
                    </HStack>
                  </Menu.Item>
                </Menu>
              </Box>
            )
          },
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
