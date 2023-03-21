import { useHeaderHeight } from "@react-navigation/elements"
import { NavigationProp } from "@react-navigation/native"
import * as Haptics from "expo-haptics"
import { observer } from "mobx-react-lite"
import { Box, HStack, Pressable, Stack, useColorModeValue } from "native-base"

import React, { FC } from "react"
import { useDebounce } from "use-debounce"

import { Screen, Text } from "../../components"
import { ContactAvatar } from "../../components/ContactAvatar"
import { useStores } from "../../models"
import { IContactFilter } from "../../models/Contact"
import { getConversationId } from "../../models/Conversation"
import { useUserPhone } from "../../models/UserProfile"
import { HomeTabScreenProps } from "../../navigators/HomeTabNavigator"
import useListContacts from "../../services/api/contacts/queries/useListContacts"
import useReadUserProfile from "../../services/api/userprofile/queries/useReadUserProfile"
import { spacing } from "../../theme"
import { useColor } from "../../theme/useColor"

import { getInitials } from "../../utils/getInitials"
import { pluralize } from "../../utils/pluralize"
import { runFormatPhoneSimple } from "../../utils/useFormatPhone"
import { DialPad } from "./DialPad"

interface IFoundContact {
  name: string
  contactId: string
  conversationId: string
  initials: string
}

export const KeypadScreen: FC<HomeTabScreenProps<"Keypad">> = observer(function ContactsScreen(
  _props,
) {
  const { navigation } = _props
  const [trackedDialerKeys, setTrackedDialerKeys] = React.useState<string[]>([])
  const [dialerDisplay, setDialerDisplay] = React.useState<string>()
  const [useFilters, setUseFilters] = React.useState<IContactFilter[] | undefined>(undefined)
  const [foundContact, setFoundContact] = React.useState<IFoundContact>()
  const [countFound, setCountFound] = React.useState<number>()

  const headerHeight = useHeaderHeight()

  const [debouncedTextSearch] = useDebounce(trackedDialerKeys, 500)

  const { contactsStore } = useStores()
  const bgHigh = useColor("bg.high")
  const bgMatch = useColorModeValue("primary.100", "primary.900")
  const colorMatch = useColorModeValue("primary.500", "primary.200")
  const avatarBg = useColorModeValue("primary.400", "primary.600")
  const bgNew = useColorModeValue("secondary.100", "secondary.900")
  const colorNew = useColorModeValue("secondary.500", "secondary.200")

  const { data: dataContacts, isLoading: isLoadingContacts } = useListContacts({
    pageLimit: contactsStore.viewLimit,
    filters: useFilters,
  })

  const { data: userProfile } = useReadUserProfile()

  const userNumber = useUserPhone(userProfile)

  const handleOnCreateContact = () => {}

  const handleOnPressContact = (contactName: string, contactId: string) => {
    Haptics.selectionAsync()

    const nav = navigation.getParent<NavigationProp<any>>()

    nav.navigate("ContactDetail", {
      contactName,
      contactId,
    })
  }

  const handleOnKeyPress = (value: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    setTrackedDialerKeys((prevValues) => [...prevValues, value])
  }
  const handleOnDeletePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    setTrackedDialerKeys((prevValues) => {
      prevValues.pop()
      return [...prevValues]
    })
  }

  const handleOnMessagePress = () => {
    if (foundContact) {
      Haptics.selectionAsync()

      const nav = navigation.getParent<NavigationProp<any>>()

      nav.navigate("ConversationStream", {
        contactName: foundContact.name,
        conversationId: foundContact.conversationId,
      })
    }
  }

  React.useEffect(() => {
    let foundContact: IFoundContact
    let countFound = 0
    if (dataContacts && useFilters) {
      if (dataContacts.pages?.length) {
        if (dataContacts.pages[0].records?.length) {
          const firstContact = dataContacts.pages[0].records[0]
          countFound = dataContacts.pages[0].records.length

          const name = `${firstContact.FirstName} ${firstContact.LastName}`
          const contactId = firstContact.ContactId
          const initials = getInitials(name)
          const conversationId = getConversationId(userNumber, firstContact.Phone)
          foundContact = {
            name,
            contactId,
            initials,
            conversationId,
          }
        }
      }
    }

    setCountFound(countFound)
    setFoundContact(foundContact)
  }, [dataContacts, useFilters])

  React.useEffect(() => {
    let dialerDisplayUpdate = debouncedTextSearch.join(" ")
    if (debouncedTextSearch && debouncedTextSearch.length === 10) {
      const joinedSearch = debouncedTextSearch.join("")

      dialerDisplayUpdate = runFormatPhoneSimple(joinedSearch)

      let allFilters: IContactFilter[] = [
        {
          field: "Searchable",
          operator: "like",
          value: joinedSearch.toLowerCase(),
        },
      ]

      setUseFilters(allFilters)
    } else {
      setUseFilters(undefined)
    }

    setDialerDisplay(dialerDisplayUpdate)
  }, [debouncedTextSearch])

  return (
    <Screen
      preset="fixed"
      contentContainerStyle={{
        paddingBottom: 0,
        flex: 1,
        paddingTop: headerHeight,
      }}
    >
      <Stack h="full" justifyContent={"center"} space={spacing.tiny}>
        <Box minH={32} h={32}>
          <Stack space={spacing.micro} h="full" justifyContent={"center"}>
            <Text
              noOfLines={1}
              textAlign={"center"}
              fontSize="3xl"
              fontWeight="semibold"
              text={dialerDisplay}
            ></Text>

            {!isLoadingContacts && foundContact ? (
              <Stack justifyContent={"center"} alignItems="center" space={0}>
                <Pressable
                  key={foundContact.contactId}
                  onPress={() => handleOnPressContact(foundContact.name, foundContact.contactId)}
                >
                  <HStack
                    w="full"
                    rounded="full"
                    bg={bgMatch}
                    space={spacing.tiny}
                    px={spacing.tiny}
                    py={0.5}
                    alignItems="center"
                  >
                    <ContactAvatar
                      avatarColor={avatarBg}
                      initials={foundContact.initials}
                      avatarProps={{ size: "xs" }}
                    ></ContactAvatar>
                    <Text
                      maxW={32}
                      fontWeight="semibold"
                      isTruncated={true}
                      color={colorMatch}
                      text={foundContact.name}
                    ></Text>
                  </HStack>
                </Pressable>

                {countFound > 1 ? (
                  <Text
                    size="xs"
                    colorToken="text.softer"
                    text={`+${pluralize(countFound - 1, "contact")}`}
                  ></Text>
                ) : null}
              </Stack>
            ) : null}

            {!isLoadingContacts && !countFound && useFilters ? (
              <HStack justifyContent={"center"} alignItems="center" space={spacing.tiny}>
                <Pressable onPress={handleOnCreateContact}>
                  <HStack
                    w="full"
                    rounded="full"
                    bg={bgNew}
                    space={spacing.tiny}
                    px={spacing.tiny}
                    py={0.5}
                    alignItems="center"
                  >
                    <Text
                      maxW={32}
                      fontWeight="semibold"
                      isTruncated={true}
                      color={colorNew}
                      text={"Add Contact"}
                    ></Text>
                  </HStack>
                </Pressable>
              </HStack>
            ) : null}
          </Stack>
        </Box>
        <Box>
          <DialPad
            trackedKeys={trackedDialerKeys}
            onKeyPress={handleOnKeyPress}
            onKeyDelete={handleOnDeletePress}
            onMessagePress={handleOnMessagePress}
            isMessageButtonDisabled={trackedDialerKeys?.length < 10 || !countFound}
            isCallButtonDisabled={trackedDialerKeys?.length < 10 || !countFound}
          />
        </Box>
      </Stack>
    </Screen>
  )
})
