import { observer } from "mobx-react-lite"
import { HStack, IconButton, Menu, Stack } from "native-base"
import React from "react"
import { Icon, Text } from "../../components"
import { useStores } from "../../models"
import { ConversationStatusEnum } from "../../models/Conversation"
import { spacing } from "../../theme"

import { StyleProp, ViewStyle } from "react-native"
import { useColor } from "../../theme/useColor"

export interface ConversationInboxPickerProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

export const ConversationInboxPicker = observer(function ConversationInboxPicker(
  props: ConversationInboxPickerProps,
) {
  const { conversationStore } = useStores()

  const txtColor = useColor("text.softer")

  const handleOnUnread = () => {
    conversationStore.setInboxView(ConversationStatusEnum.UNREAD)
  }

  const handleOnActive = () => {
    conversationStore.setInboxView(ConversationStatusEnum.OPEN)
  }

  const handleOnClosed = () => {
    conversationStore.setInboxView(ConversationStatusEnum.CLOSED)
  }

  return (
    <Stack position="relative">
      <Menu
        w="48"
        trigger={(triggerProps) => {
          return (
            <IconButton
              size="sm"
              variant={"ghost"}
              colorScheme={"gray"}
              _text={{
                color: txtColor,
              }}
              accessibilityLabel="Select inbox filter"
              icon={<Icon icon="inbox"></Icon>}
              {...triggerProps}
            ></IconButton>
          )
        }}
      >
        <Menu.Item onPress={handleOnUnread}>
          <HStack space={spacing.tiny} alignItems="center">
            <Text flex={1} colorToken={"text"} tx="inbox.unread"></Text>
            <Icon size={24} colorToken={"text"} icon="bellAlert"></Icon>
          </HStack>
        </Menu.Item>
        <Menu.Item onPress={handleOnActive}>
          <HStack space={spacing.tiny} alignItems="center">
            <Text flex={1} colorToken={"text"} tx="inbox.active"></Text>
            <Icon size={24} colorToken={"text"} icon="chat"></Icon>
          </HStack>
        </Menu.Item>
        <Menu.Item onPress={handleOnClosed}>
          <HStack space={spacing.tiny} alignItems="center">
            <Text flex={1} colorToken={"text"} tx="inbox.completed"></Text>
            <Icon size={24} colorToken={"text"} icon="checkCircle"></Icon>
          </HStack>
        </Menu.Item>
      </Menu>
    </Stack>
  )
})
