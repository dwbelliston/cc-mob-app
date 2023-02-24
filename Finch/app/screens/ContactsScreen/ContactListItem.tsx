import * as Haptics from "expo-haptics"
import { Box, HStack, Pressable, Stack, useColorModeValue, View } from "native-base"
import React from "react"

import Swipeable from "react-native-gesture-handler/Swipeable"
import { Icon, Text } from "../../components"
import { getAvatarColor, spacing } from "../../theme"
import { useColor } from "../../theme/useColor"
import { getInitials } from "../../utils/getInitials"

import { useActionSheet } from "@expo/react-native-action-sheet"
import { ContactAvatar } from "../../components/ContactAvatar"
import { IContact } from "../../models/Contact"
import { runFormatPhoneSimple } from "../../utils/useFormatPhone"

export interface IContactListItemData {
  contactId: string
  contactName: string
  contactEmail: string
  contactNumber: string
  avatarColor: string
  initials: string
  contactSourceType?: IContact["SourceType"]
  lastContactTime: string
  sourceType: string
}

export interface IContactListItem extends IContactListItemData {
  onEmail: (contactName: string, contactEmail: string) => void
  onText: (contactNumber: string) => void
  onViewContact: ({ contactName, contactId }: { contactName: string; contactId: string }) => void
}

interface IRightActions {
  contactName: string
  onViewContact: () => void
  onText: () => void
  onEmail: () => void
}

export const makeContactListItemData = (contact: IContact): IContactListItemData => {
  const contactId = contact.ContactId
  const contactName = `${contact.FirstName} ${contact.LastName}`
  const contactEmail = contact.Email
  const contactNumber = contact.Phone
  const avatarColor = getAvatarColor(contactName)
  const initials = getInitials(contactName)
  const lastContactTime = contact.LastContactedTime
  const contactSourceType = contact.SourceType
  const sourceType = contact.SourceType

  return {
    contactId,
    contactName,
    contactEmail,
    contactNumber,
    avatarColor,
    initials,
    lastContactTime,
    contactSourceType,
    sourceType,
  }
}

const RightSwipeActions = ({ contactName, onEmail, onText, onViewContact }: IRightActions) => {
  const moreBg = useColorModeValue("gray.100", "gray.800")
  const activeBg = useColorModeValue("primary.600", "primary.800")

  const { showActionSheetWithOptions } = useActionSheet()

  const title = contactName

  const handleOnMore = () => {
    const options = ["Email", "Message", "View Contact", "Cancel"]
    const destructiveButtonIndex = 3
    const cancelButtonIndex = 3

    showActionSheetWithOptions(
      {
        title,
        options,
        cancelButtonIndex,
        // destructiveButtonIndex,
      },
      (selectedIndex: number) => {
        switch (selectedIndex) {
          case 0:
            onEmail()
            // Block
            break

          case 1:
            onText()
            break

          case 2:
            onViewContact()
            break

          case cancelButtonIndex:
          // Canceled
        }
      },
    )
  }

  return (
    <View bg={moreBg}>
      <HStack h={"full"}>
        <Pressable onPress={handleOnMore} bg={moreBg} w={24} px={spacing.micro}>
          <Stack h="full" alignItems={"center"} justifyContent="center">
            <Icon colorToken="text.soft" icon="ellipsisHorizontal"></Icon>
            <Text fontSize="xs" fontFamily={"mono"} colorToken="text.soft" fontWeight="semibold">
              More
            </Text>
          </Stack>
        </Pressable>
        <Pressable onPress={onText} bg={activeBg} w={24} px={spacing.micro}>
          <Stack h="full" alignItems={"center"} justifyContent="center">
            <Icon color="white" icon="chatBubbleLeft"></Icon>
            <Text fontSize="xs" fontFamily={"mono"} color="white" fontWeight="semibold">
              Text
            </Text>
          </Stack>
        </Pressable>
      </HStack>
    </View>
  )
}

const ContactListItem = ({
  contactId,
  contactName,
  contactEmail,
  contactNumber,
  avatarColor,
  initials,
  contactSourceType,
  lastContactTime,
  sourceType,
  onEmail,
  onText,
  onViewContact,
}: IContactListItem) => {
  const swipeableRef = React.useRef(null)

  const errorColor = useColorModeValue("error.300", "error.400")
  const cardBg = useColor("bg.main")

  const closeSwipeable = () => {
    Haptics.selectionAsync()
    swipeableRef.current.close()
  }

  const handleOnEmail = () => {
    closeSwipeable()
    onEmail(contactName, contactEmail)
  }

  const handleOnText = () => {
    closeSwipeable()
    onText(contactNumber)
  }

  const handleOnClickContact = () => {
    closeSwipeable()
    onViewContact({ contactName, contactId })
  }

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={() => (
        <RightSwipeActions
          contactName={contactName}
          onText={handleOnText}
          onViewContact={handleOnClickContact}
          onEmail={handleOnEmail}
        />
      )}
      overshootLeft={false}
      overshootRight={false}
    >
      <Pressable onPress={handleOnClickContact}>
        <HStack bg={cardBg} py={spacing.tiny} px={spacing.tiny} space={4} alignItems="center">
          <ContactAvatar
            innerRingColor={cardBg}
            avatarColor={avatarColor}
            initials={initials}
            avatarProps={{ size: "md" }}
            contactSource={contactSourceType}
          ></ContactAvatar>

          <Stack flex={1}>
            <HStack alignItems="center" justifyContent={"space-between"} space={spacing.micro}>
              <Text
                flex={1}
                numberOfLines={1}
                colorToken={"text"}
                fontWeight="semibold"
                fontSize="md"
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
                fontWeight={"normal"}
                text={runFormatPhoneSimple(contactNumber)}
              ></Text>
            </HStack>
          </Stack>

          <Box alignItems="center">
            <Icon colorToken={"text.softer"} icon="ellipsisVertical"></Icon>
          </Box>
        </HStack>
      </Pressable>
    </Swipeable>
  )
}

export const PureContactListItem = React.memo(ContactListItem)
