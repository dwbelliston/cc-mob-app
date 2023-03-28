import * as Haptics from "expo-haptics"
import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import { Keyboard } from "react-native"
import * as yup from "yup"
import { Button, Icon, Screen, Text } from "../../components"

import {
  Box,
  Center,
  HStack,
  IPressableProps,
  Pressable,
  Spinner,
  Stack,
  useColorModeValue,
} from "native-base"
import { AppStackScreenProps } from "../../navigators"
import { spacing } from "../../theme"

import { Input } from "native-base"
import { useSharedValue } from "react-native-reanimated"
import { useDebounce } from "use-debounce"
import { AnimatedBackground } from "../../components/AnimatedBackground"
import { ContactAvatar } from "../../components/ContactAvatar"
import { DataStatus } from "../../components/DataStatus"
import { PressableActionRow } from "../../components/PressableActionRow"
import { translate } from "../../i18n"
import { useStores } from "../../models"
import { IContact, IContactFilter } from "../../models/Contact"
import { getConversationId } from "../../models/Conversation"
import { useUserPhone } from "../../models/UserProfile"
import useListContacts from "../../services/api/contacts/queries/useListContacts"
import useReadUserProfile from "../../services/api/userprofile/queries/useReadUserProfile"
import { useColor } from "../../theme/useColor"
import { getInitials } from "../../utils/getInitials"
import { runFormatPhoneSimple } from "../../utils/useFormatPhone"

interface IPressableContactProps extends IPressableProps {
  contact: IContact
  onPress: () => void
}
const PressableContact = ({ contact, ...rest }: IPressableContactProps) => {
  const progress = useSharedValue(0)

  const cardBg = useColor("bg.main")
  const cardBorder = useColorModeValue("gray.200", "gray.700")

  const handleOnPress = () => {
    // haptic on the avatar already
    progress.value = 1
    Haptics.selectionAsync()
    if (rest.onPress) {
      rest.onPress()
    }
  }

  return (
    <Pressable key={contact.ContactId} {...rest} onPress={handleOnPress}>
      <AnimatedBackground
        sharedValue={progress}
        bgStart="bg.animStart"
        bgEnd="bg.animEnd"
        styles={{ borderRadius: 12 }}
      >
        <HStack
          borderColor={cardBorder}
          borderWidth={1}
          rounded="lg"
          py={spacing.tiny}
          px={spacing.micro}
          space={2}
          alignItems="center"
        >
          <ContactAvatar
            innerRingColor={cardBg}
            initials={getInitials(`${contact.FirstName} ${contact.LastName}`)}
            avatarProps={{ size: "sm" }}
            onPress={handleOnPress}
          ></ContactAvatar>

          <Stack flex={1}>
            <HStack alignItems="center" justifyContent={"flex-start"} space={1}>
              <Text
                numberOfLines={1}
                colorToken={"text"}
                fontSize="md"
                text={contact.FirstName}
              ></Text>
              <Text
                numberOfLines={1}
                colorToken={"text"}
                fontSize="md"
                text={contact.LastName}
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
                text={runFormatPhoneSimple(contact.Phone)}
              ></Text>
            </HStack>
          </Stack>

          <Box alignItems="center" px={spacing.micro}>
            <Icon colorToken={"text.softer"} icon="chatBubbleOvalLeftEllipsis"></Icon>
          </Box>
        </HStack>
      </AnimatedBackground>
    </Pressable>
  )
}

export const schema = yup.object().shape({
  search: yup.string().required("Required"),
})

export const NewMessageScreen: FC<AppStackScreenProps<"NewMessage">> = observer(
  function NewMessageScreen(_props) {
    const { navigation, route } = _props
    const [searchInput, setSearchInput] = React.useState("")
    const [foundContacts, setFoundContacts] = React.useState<IContact[]>([])

    const [useFilters, setUseFilters] = React.useState<IContactFilter[] | undefined>(undefined)

    const { contactsStore } = useStores()

    const [debouncedTextSearch] = useDebounce(searchInput, 500)

    const { data: userProfile } = useReadUserProfile()
    const {
      data: dataContacts,
      isLoading: isLoadingContacts,
      isError: isErrorContacts,
    } = useListContacts({
      pageLimit: 10,
      filters: useFilters,
    })
    const userNumber = useUserPhone(userProfile)

    const bgHigh = useColor("bg.high")

    const handleOnChange = (textIn: string) => {
      setSearchInput(textIn)
    }

    const handleOnSelectContact = (contact: IContact) => {
      Keyboard.dismiss()

      const contactName = `${contact.FirstName} ${contact.LastName}`
      const conversationId = getConversationId(userNumber, contact.Phone)
      navigation.replace("ConversationStream", {
        contactId: contact.ContactId,
        contactName,
        conversationNumber: contact.Phone,
        conversationId,
      })
    }

    const handleClearSearch = () => {
      Haptics.selectionAsync()
      setSearchInput("")
    }

    const createNewContact = () => {
      navigation.replace("AddContact", { contactPhone: searchInput })
    }

    React.useEffect(() => {
      // Update search filters

      if (debouncedTextSearch) {
        let allFilters: IContactFilter[] = [
          {
            field: "Searchable",
            operator: "like",
            value: debouncedTextSearch.toLowerCase(),
          },
        ]

        setUseFilters(allFilters)
      } else {
        setUseFilters(undefined)
      }
    }, [debouncedTextSearch])

    React.useEffect(() => {
      let foundContacts: IContact[] = []

      if (dataContacts && useFilters) {
        if (dataContacts.pages?.length) {
          if (dataContacts.pages[0].records) {
            foundContacts = dataContacts.pages[0].records
          }
        }
      }

      setFoundContacts(foundContacts)
    }, [dataContacts, useFilters])

    return (
      <Screen preset="scroll">
        <Stack space={spacing.micro} pt={spacing.tiny} pb={spacing.small}>
          <Box px={spacing.tiny}>
            <Input
              leftElement={<Box w={2} h={2} bg="red.200" />}
              InputLeftElement={
                <Center mx={spacing.micro} py={1} px={spacing.micro} bg={bgHigh} rounded="md">
                  <Text tx="fieldLabels.to"></Text>
                </Center>
              }
              value={searchInput}
              keyboardType="name-phone-pad"
              onChangeText={handleOnChange}
              placeholder={translate("fieldLabels.searchByNamePhone")}
              autoCapitalize="none"
              autoComplete="tel"
            ></Input>
          </Box>
          <PressableActionRow
            tx="contacts.addNewContact"
            icon={{
              icon: "userPlus",
            }}
            onPress={createNewContact}
          ></PressableActionRow>

          <Stack space={spacing.micro} flex={1} px={spacing.tiny}>
            {isLoadingContacts ? (
              <Center>
                <Spinner></Spinner>
              </Center>
            ) : null}
            {foundContacts?.map((fContact) => {
              return (
                <PressableContact
                  key={fContact.ContactId}
                  contact={fContact}
                  onPress={() => handleOnSelectContact(fContact)}
                ></PressableContact>
              )
            })}
            {!isLoadingContacts && useFilters && !foundContacts.length ? (
              <Stack>
                <Box flex={1}>
                  <DataStatus
                    title={translate("inbox.noDataNewMessageTitle")}
                    description={translate("inbox.noDataNewMessageDescription")}
                    icon={"magnifyingGlass"}
                    colorScheme={"amber"}
                  />
                </Box>
                <Center>
                  <Button onPress={handleClearSearch} size="xs" tx="common.clearSearch"></Button>
                </Center>
              </Stack>
            ) : null}
            {isErrorContacts ? (
              <Box flex={1}>
                <DataStatus
                  title={translate("common.errorTitle")}
                  description={translate("common.errorDescription")}
                  icon={"fire"}
                  colorScheme={"rose"}
                />
              </Box>
            ) : null}
          </Stack>
        </Stack>
      </Screen>
    )
  },
)
