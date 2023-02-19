import * as Haptics from "expo-haptics"
import { Box, HStack, Pressable, Stack, useColorModeValue, View } from "native-base"
import React from "react"

import Swipeable from "react-native-gesture-handler/Swipeable"
import { Icon, Text } from "../../components"
import { AvatarRing } from "../../components/AvatarRing"
import { getAvatarColor, spacing } from "../../theme"
import { useColor } from "../../theme/useColor"
import { getInitials } from "../../utils/getInitials"
import { runFormatPhoneSimple } from "../../utils/useFormatPhone"

import { useActionSheet } from "@expo/react-native-action-sheet"
import { IContact } from "../../models/Contact"

interface IProps {
  contact: IContact
}

interface ILeftActions extends IProps {}

interface IRightActions extends IProps {
  onBlock: () => void
  onViewContact: () => void
}

interface ContactListItem extends IRightActions, ILeftActions {
  // onClickConversation: (conversation: IConversation) => void;
}

const LeftSwipeActions = ({ contact }: ILeftActions) => {
  const unreadBg = useColorModeValue("error.200", "error.300")
  const unreadColor = useColorModeValue("error.900", "error.900")
  const readBg = useColorModeValue("success.100", "success.300")
  const readColor = useColorModeValue("success.900", "success.900")

  return (
    <View bg={unreadBg}>
      <Pressable w={32} px={spacing.tiny}>
        <Stack h="full" alignItems={"center"} justifyContent="center">
          <Icon color={unreadColor} icon="bellAlert"></Icon>
          <Text fontSize="xs" fontFamily={"mono"} color={unreadColor} fontWeight="semibold">
            Hey
          </Text>
        </Stack>
      </Pressable>
    </View>
  )
}
const RightSwipeActions = ({ contact, onViewContact, onBlock }: IRightActions) => {
  const moreBg = useColorModeValue("gray.100", "gray.800")
  const statusBg = useColorModeValue("primary.600", "primary.800")

  const { showActionSheetWithOptions } = useActionSheet()

  return (
    <View bg={moreBg}>
      <HStack h={"full"}>
        <Pressable bg={moreBg} w={24} px={spacing.micro}>
          <Stack h="full" alignItems={"center"} justifyContent="center">
            <Icon colorToken="text.soft" icon="ellipsisHorizontal"></Icon>
            <Text fontSize="xs" fontFamily={"mono"} colorToken="text.soft" fontWeight="semibold">
              More
            </Text>
          </Stack>
        </Pressable>
      </HStack>
    </View>
  )
}

const ContactListItem = ({ contact, onBlock, onViewContact }: ContactListItem) => {
  const swipeableRef = React.useRef(null)

  const contactName = `${contact.FirstName} ${contact.LastName}`

  const avatarColor = getAvatarColor(contactName)
  const initials = getInitials(contactName)

  const errorColor = useColorModeValue("error.300", "error.400")
  const cardBg = useColor("bg.main")

  const closeSwipeable = () => {
    Haptics.selectionAsync()
    swipeableRef.current.close()
  }

  const handleOnBlock = () => {
    closeSwipeable()
    onBlock()
  }

  const handleOnViewContact = () => {
    closeSwipeable()
    onViewContact()
  }

  return (
    <Swipeable
      ref={swipeableRef}
      renderLeftActions={() => <LeftSwipeActions contact={contact} />}
      renderRightActions={() => (
        <RightSwipeActions
          contact={contact}
          onBlock={handleOnBlock}
          onViewContact={handleOnViewContact}
        />
      )}
      overshootLeft={false}
      overshootRight={false}
    >
      <HStack bg={cardBg} py={spacing.tiny} px={spacing.tiny} space={4} alignItems="center">
        <AvatarRing
          outerRingColor={cardBg}
          innerRingColor={cardBg}
          avatarColor={avatarColor}
          initials={initials}
        ></AvatarRing>

        <Stack flex={1}>
          <HStack alignItems="center" justifyContent={"space-between"} space={spacing.micro}>
            <Text
              flex={1}
              numberOfLines={1}
              colorToken={"text"}
              fontWeight="semibold"
              text={contactName}
            ></Text>
          </HStack>
          <HStack alignItems="center" space={spacing.micro}>
            <Text
              flex={1}
              numberOfLines={1}
              maxH={12}
              fontSize="sm"
              colorToken={"text.soft"}
              text={runFormatPhoneSimple(contact.Phone)}
            ></Text>
          </HStack>
        </Stack>

        <Box alignItems="center">
          <Icon colorToken={"text.softer"} icon="ellipsisVertical"></Icon>
        </Box>
      </HStack>
    </Swipeable>
  )
}

export const PureContactListItem = React.memo(ContactListItem)
