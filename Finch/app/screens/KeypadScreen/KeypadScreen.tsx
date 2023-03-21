import { useHeaderHeight } from "@react-navigation/elements"
import { NavigationProp } from "@react-navigation/native"
import * as Haptics from "expo-haptics"
import { observer } from "mobx-react-lite"
import { Box, Center, HStack, Pressable, Stack, useColorModeValue, View } from "native-base"

import React, { FC } from "react"
import { useDebounce } from "use-debounce"

import { Screen, Text } from "../../components"
import { ContactAvatar } from "../../components/ContactAvatar"
import { useStores } from "../../models"
import { IContactFilter } from "../../models/Contact"
import { HomeTabScreenProps } from "../../navigators/HomeTabNavigator"
import useListContacts from "../../services/api/contacts/queries/useListContacts"
import { spacing } from "../../theme"
import { useColor } from "../../theme/useColor"

import { getInitials } from "../../utils/getInitials"
import { pluralize } from "../../utils/pluralize"
import { runFormatPhoneSimple } from "../../utils/useFormatPhone"
import { DialPad } from "./DialPad"

interface IFoundContact {
  name: string
  contactId: string
  initials: string
}

export const KeypadScreen: FC<HomeTabScreenProps<"Keypad">> = observer(function ContactsScreen(
  _props,
) {
  const { navigation } = _props
  const [trackedDialerKeys, setTrackedDialerKeys] = React.useState<string[]>(["1", "2"])
  const [dialerDisplay, setDialerDisplay] = React.useState<string>()
  const [useFilters, setUseFilters] = React.useState<IContactFilter[] | undefined>(undefined)
  const [flatData, setFlatData] = React.useState<IFoundContact[]>()

  const headerHeight = useHeaderHeight()

  const [debouncedTextSearch] = useDebounce(trackedDialerKeys, 500)

  const { contactsStore } = useStores()
  const bgHigh = useColor("bg.high")
  const bgMatch = useColorModeValue("primary.100", "primary.900")
  const colorMatch = useColorModeValue("primary.500", "primary.200")
  const avatarBg = useColorModeValue("primary.400", "primary.600")

  const { data: dataContacts, isLoading: isLoadingContacts } = useListContacts({
    pageLimit: contactsStore.viewLimit,
    filters: useFilters,
  })

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

  React.useEffect(() => {
    let matchingContacts: IFoundContact[] = []
    if (dataContacts && useFilters) {
      matchingContacts = dataContacts.pages.flatMap((page, idx) =>
        page.records.flatMap((contact, idx) => ({
          name: `${contact.FirstName} ${contact.LastName}`,
          contactId: contact.ContactId,
          initials: getInitials(`${contact.FirstName} ${contact.LastName}`),
        })),
      )
    }
    setFlatData(matchingContacts)
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
        paddingTop: headerHeight,
      }}
    >
      <View h="full" borderWidth={4} borderColor="red.400">
        <Box borderWidth={4} borderColor="red.900" minH={32} h={32}>
          <Center h="full">
            <Stack space={spacing.micro}>
              <Text
                noOfLines={1}
                textAlign={"center"}
                fontSize="3xl"
                fontWeight="semibold"
                text={dialerDisplay}
              ></Text>

              {!isLoadingContacts && flatData && flatData?.length ? (
                <HStack justifyContent={"center"} alignItems="center" space={spacing.tiny}>
                  {flatData?.slice(0, 1).map((fContact) => {
                    return (
                      <Pressable
                        key={fContact.contactId}
                        onPress={() => handleOnPressContact(fContact.name, fContact.contactId)}
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
                            initials={fContact.initials}
                            avatarProps={{ size: "xs" }}
                          ></ContactAvatar>
                          <Text
                            maxW={32}
                            isTruncated={true}
                            color={colorMatch}
                            text={"dustin belliston belliston william"}
                          ></Text>
                          {/* <Text color={colorMatch} text={fContact.name}></Text> */}
                        </HStack>
                      </Pressable>
                    )
                  })}
                  {flatData?.length > 1 ? (
                    <Text
                      colorToken="text.softer"
                      text={`+${pluralize(flatData?.length - 1, "contact")}`}
                    ></Text>
                  ) : null}
                </HStack>
              ) : null}
            </Stack>
          </Center>
        </Box>
        <Box flex={1} borderWidth={4} borderColor="green.900">
          <Center h="full">
            <DialPad
              trackedKeys={trackedDialerKeys}
              onKeyPress={handleOnKeyPress}
              onKeyDelete={handleOnDeletePress}
            />
          </Center>
        </Box>
      </View>
    </Screen>
  )
})
