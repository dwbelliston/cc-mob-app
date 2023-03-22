import { useHeaderHeight } from "@react-navigation/elements"
import { NavigationProp } from "@react-navigation/native"
import * as Haptics from "expo-haptics"
import { observer } from "mobx-react-lite"
import { Box, HStack, Pressable, Stack, useColorModeValue } from "native-base"

import React, { FC } from "react"
import { useDebounce } from "use-debounce"

import * as Linking from "expo-linking"
import { Button, Icon, IconButton, Screen, Text } from "../../components"
import { useStores } from "../../models"
import { IContactCreate, IContactFilter } from "../../models/Contact"
import { getConversationId } from "../../models/Conversation"
import { useUserPhone } from "../../models/UserProfile"
import { HomeTabScreenProps } from "../../navigators/HomeTabNavigator"
import useListContacts from "../../services/api/contacts/queries/useListContacts"
import useReadUserProfile from "../../services/api/userprofile/queries/useReadUserProfile"
import { spacing } from "../../theme"
import { useColor } from "../../theme/useColor"

import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet"
import { gestureHandlerRootHOC } from "react-native-gesture-handler"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { translate } from "../../i18n"
import useCreateContacts from "../../services/api/contacts/mutations/useCreateContacts"
import { getInitials } from "../../utils/getInitials"
import { pluralize } from "../../utils/pluralize"
import { useCustomToast } from "../../utils/useCustomToast"
import { runFormatPhoneSimple } from "../../utils/useFormatPhone"
import { AddContactForm, AddContactFormHandle } from "../ContactsScreen/AddContactForm"
import { ContactSmudgePressable } from "../ContactsScreen/ContactSmudgePressable"
import { DialPad } from "./DialPad"

interface IFoundContact {
  name: string
  contactId: string
  contactNumber: string
  conversationId: string
  initials: string
}

enum EditFormModeEnum {
  CREATE_CONTACT = "CREATE_CONTACT",
}

const KeypadScreenBase: FC<HomeTabScreenProps<"Keypad">> = observer(function ContactsScreen(
  _props,
) {
  const { navigation } = _props
  const [editMode, setEditMode] = React.useState<EditFormModeEnum>()
  const [trackedDialerKeys, setTrackedDialerKeys] = React.useState<string[]>([])
  const [dialerDisplay, setDialerDisplay] = React.useState<string>()
  const [useFilters, setUseFilters] = React.useState<IContactFilter[] | undefined>(undefined)
  const [foundContact, setFoundContact] = React.useState<IFoundContact>()
  const [countFound, setCountFound] = React.useState<number>()
  const bottomSheetModalRef = React.useRef<BottomSheetModal>(null)
  const formRef = React.useRef<AddContactFormHandle>(null)

  const headerHeight = useHeaderHeight()

  const [debouncedTextSearch] = useDebounce(trackedDialerKeys, 500)

  const snapPoints = React.useMemo(() => ["50%", "80%", "100%"], [])
  const { top: topInset } = useSafeAreaInsets()

  const toast = useCustomToast()

  const borderColor = useColor("text.softest")
  const bgHighColor = useColor("bg.high")
  const bgCard = useColor("bg.high")
  const bgColor = useColor("bg.main")

  const { contactsStore } = useStores()

  const bgNew = useColorModeValue("secondary.100", "secondary.900")
  const colorNew = useColorModeValue("secondary.500", "secondary.200")

  const { data: dataContacts, isLoading: isLoadingContacts } = useListContacts({
    pageLimit: contactsStore.viewLimit,
    filters: useFilters,
  })

  const { data: userProfile } = useReadUserProfile()
  const { mutateAsync: mutateAsyncCreate, isLoading: isLoadingCreate } = useCreateContacts()

  const userNumber = useUserPhone(userProfile)

  const handleOnCreateContact = () => {
    // Open bottom sheet
    setEditMode(EditFormModeEnum.CREATE_CONTACT)
    bottomSheetModalRef.current?.present()
  }

  const handleOnPressContact = (contactName: string, contactId: string) => {
    Haptics.selectionAsync()

    const nav = navigation.getParent<NavigationProp<any>>()

    nav.navigate("ContactDetail", {
      contactName,
      contactId,
    })
  }

  const handleOnKeyPress = (value: string) => {
    Haptics.selectionAsync()
    setTrackedDialerKeys((prevValues) => [...prevValues, value])
  }

  const onClearAll = () => {
    setTrackedDialerKeys([])
  }
  const handleOnDeletePress = () => {
    Haptics.selectionAsync()
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
        conversationNumber: foundContact.contactNumber,
        contactId: foundContact.contactId,
      })
    }
  }

  const handleOnCallPress = () => {
    Haptics.selectionAsync()
    if (debouncedTextSearch.length > 9) {
      const joinedSearch = debouncedTextSearch.join("")
      Linking.openURL(`tel:${joinedSearch}`)
    }
  }

  const handleOnCancel = () => {
    setEditMode(undefined)
    bottomSheetModalRef.current?.dismiss()
  }

  const handleOnSubmitAddContact = async (data: IContactCreate) => {
    try {
      await mutateAsyncCreate([data])
      toast.success({ title: translate("common.created") })
      handleOnCancel()
    } catch (e) {
      toast.error({ title: "Error saving" })
    }
  }

  const handleOnSave = () => {
    formRef.current.submitForm()
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
          const contactNumber = firstContact.Phone
          const initials = getInitials(name)
          const conversationId = getConversationId(userNumber, firstContact.Phone)
          foundContact = {
            name,
            contactId,
            initials,
            conversationId,
            contactNumber,
          }
        }
      }
    }

    setCountFound(countFound)
    setFoundContact(foundContact)
  }, [dataContacts, useFilters])

  React.useEffect(() => {
    // Update search filters
    if (debouncedTextSearch && debouncedTextSearch.length === 10) {
      const joinedSearch = debouncedTextSearch.join("")

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
  }, [debouncedTextSearch])

  React.useEffect(() => {
    // Update dialer
    let dialerDisplayUpdate = ""
    if (trackedDialerKeys.length === 10) {
      const joinedSearch = trackedDialerKeys.join("")

      dialerDisplayUpdate = runFormatPhoneSimple(joinedSearch)
    } else {
      dialerDisplayUpdate = trackedDialerKeys.join(" ")
    }

    setDialerDisplay(dialerDisplayUpdate)
  }, [trackedDialerKeys])

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
              adjustsFontSizeToFit={true}
              fontSize="3xl"
              fontWeight="semibold"
              text={dialerDisplay}
            ></Text>

            {!isLoadingContacts && foundContact ? (
              <Stack justifyContent={"center"} alignItems="center" space={0}>
                <HStack alignItems="center" space={1}>
                  <ContactSmudgePressable
                    onPress={() => handleOnPressContact(foundContact.name, foundContact.contactId)}
                    name={foundContact.name}
                  />
                  <IconButton
                    variant={"ghost"}
                    onPress={onClearAll}
                    icon={<Icon colorToken={"error"} icon={"xMark"} />}
                  />
                </HStack>

                {countFound > 1 ? (
                  <Text
                    size="xs"
                    colorToken="text.softer"
                    text={`+${pluralize(countFound - 1, "contact")} share this number`}
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
            onCallPress={handleOnCallPress}
            isMessageButtonDisabled={trackedDialerKeys?.length < 10 || !countFound}
            isCallButtonDisabled={trackedDialerKeys?.length < 10 || !countFound}
          />
        </Box>
      </Stack>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        topInset={topInset}
        style={{
          borderTopWidth: 1,
          borderTopColor: borderColor,
        }}
        handleStyle={{
          backgroundColor: bgHighColor,
        }}
        handleIndicatorStyle={{
          backgroundColor: borderColor,
        }}
      >
        <Box
          pb={spacing.tiny}
          px={spacing.tiny}
          borderBottomWidth={1}
          borderBottomColor={borderColor}
          bg={bgHighColor}
        >
          <HStack justifyContent={"space-between"}>
            <Box flex={1}>
              <Button onPress={handleOnCancel} size="xs" tx="common.cancel"></Button>
            </Box>

            <Text
              flex={3}
              preset="heading"
              textAlign={"center"}
              fontSize="xl"
              tx="common.new"
            ></Text>

            <Box flex={1}>
              <Button
                isLoading={isLoadingCreate}
                onPress={handleOnSave}
                size="xs"
                colorScheme={"primary"}
                tx="common.save"
              ></Button>
            </Box>
          </HStack>
        </Box>
        <BottomSheetScrollView
          style={{
            flex: 1,
            backgroundColor: bgColor,
          }}
        >
          {editMode === EditFormModeEnum.CREATE_CONTACT ? (
            <AddContactForm
              ref={formRef}
              phone={debouncedTextSearch.join("")}
              onSubmit={handleOnSubmitAddContact}
            />
          ) : null}
        </BottomSheetScrollView>
      </BottomSheetModal>
    </Screen>
  )
})

export const KeypadScreen = gestureHandlerRootHOC(KeypadScreenBase)
