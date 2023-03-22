import { observer } from "mobx-react-lite"
import { Box, IconButton } from "native-base"
import React from "react"
import { Icon } from "../../components"
import { useStores } from "../../models"

import { useActionSheet } from "@expo/react-native-action-sheet"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { StyleProp, ViewStyle } from "react-native"
import { translate } from "../../i18n"
import { runFormatPhoneSimple } from "../../utils/useFormatPhone"

export interface ConversationSteamDetailMenuProps {
  conversationNumber?: string
  contactName?: string
  contactId?: string
  conversationId?: string
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

export const ConversationSteamDetailMenu = observer(function ConversationSteamDetailMenu(
  props: ConversationSteamDetailMenuProps,
) {
  const { conversationNumber, contactId, contactName, conversationId, ...rest } = props
  const { conversationStore } = useStores()

  const navigation = useNavigation<NavigationProp<any>>()

  const { showActionSheetWithOptions } = useActionSheet()

  const title = runFormatPhoneSimple(conversationNumber)

  const handleOnViewContact = () => {
    navigation.navigate<any>("ContactDetail", {
      contactName,
      contactId,
    })
  }
  const handleOnAddContact = () => {
    navigation.navigate<any>("AddContact", {
      contactPhone: conversationNumber,
      assignConversationId: conversationId,
    })
  }

  const handleOnContactAction = () => {
    let options = [translate("contacts.viewContact"), translate("common.cancel")]
    const cancelButtonIndex = 1

    showActionSheetWithOptions(
      {
        title,
        options,
        cancelButtonIndex,
      },
      (selectedIndex: number) => {
        switch (selectedIndex) {
          case 0:
            // View Contact
            handleOnViewContact()
            break

          case cancelButtonIndex:
          // Canceled
        }
      },
    )
  }
  const handleOnNoContactAction = () => {
    let options = [translate("contacts.createContact"), translate("common.cancel")]

    const cancelButtonIndex = 1

    showActionSheetWithOptions(
      {
        title,
        options,
        cancelButtonIndex,
      },
      (selectedIndex: number) => {
        switch (selectedIndex) {
          case 0:
            // View Contact
            handleOnAddContact()
            break

          case cancelButtonIndex:
          // Canceled
        }
      },
    )
  }

  return (
    <Box position="relative">
      {contactId ? (
        <IconButton
          onPress={handleOnContactAction}
          size="sm"
          variant={"ghost"}
          colorScheme={"gray"}
          accessibilityLabel="View contact"
          icon={<Icon icon="menu"></Icon>}
        ></IconButton>
      ) : (
        <IconButton
          onPress={handleOnNoContactAction}
          size="sm"
          variant={"ghost"}
          colorScheme={"gray"}
          accessibilityLabel="View contact"
          icon={<Icon icon="menu"></Icon>}
        ></IconButton>
      )}
    </Box>
  )
})
