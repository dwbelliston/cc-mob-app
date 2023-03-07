import { useHeaderHeight } from "@react-navigation/elements"
import { observer } from "mobx-react-lite"
import { Box, Divider, FlatList, useColorModeValue, View } from "native-base"
import React, { FC } from "react"
import { useDebounce } from "use-debounce"

import * as MailComposer from "expo-mail-composer"
import { Screen, Text } from "../../components"
import { DataStatus } from "../../components/DataStatus"
import { useStores } from "../../models"
import { IContactFilter } from "../../models/Contact"
import useListContacts from "../../services/api/contacts/queries/useListContacts"
import { spacing } from "../../theme"

import { Platform } from "react-native"
import { getConversationId } from "../../models/Conversation"
import { useUserPhone } from "../../models/UserProfile"
import useReadUserProfile from "../../services/api/userprofile/queries/useReadUserProfile"
import { useCustomToast } from "../../utils/useCustomToast"
import {
  IContactListItemData,
  makeContactListItemData,
  PureContactListItem,
} from "./ContactListItem"
import { ContactsStackParamList, ContactsStackScreenProps } from "./ContactsStack"

export const ContactsScreen: FC<ContactsStackScreenProps<"ContactsList">> = observer(
  function ContactsScreen(_props) {
    const [isEmailEnabled, setIsEmailEnabled] = React.useState<boolean>(false)
    const [flatData, setFlatData] = React.useState<IContactListItemData[]>()

    const [useFilters, setUseFilters] = React.useState<IContactFilter[] | undefined>([])

    const { data: userProfile } = useReadUserProfile()

    const userNumber = useUserPhone(userProfile)

    const { contactsStore } = useStores()
    const toast = useCustomToast()

    const { navigation } = _props

    const statusBarColor = useColorModeValue("dark", "light")

    const [contactsSearch, setContactsSearch] = React.useState("")

    const [debouncedContactsSearch] = useDebounce(contactsSearch, 750)

    const headerHeight = useHeaderHeight()

    const {
      data: dataContacts,
      isFetching: isFetchingContacts,
      isLoading: isLoadingContacts,
      fetchNextPage,
    } = useListContacts({
      pageLimit: contactsStore.viewLimit,
      filters: useFilters,
    })

    const handleLoadMore = () => {
      if (!isFetchingContacts) {
        if (dataContacts?.pages) {
          const lastPage = dataContacts?.pages.length - 1

          if (dataContacts?.pages[lastPage].meta.cursor) {
            fetchNextPage()
          }
        }
      }
    }

    const handleOnEmail = React.useCallback(async (contactName: string, contactEmail: string) => {
      if (!isEmailEnabled) {
        // On iOS device without Mail app installed it is possible to show mail composer,
        // but it isn't possible to send that email either way.
        if (Platform.OS === "ios") {
          toast.info({
            title: "Email not configured.",
            description: "Make sure you have the Apple Mail app installed",
          })
        } else {
          toast.info({
            title: "Email not configured.",
            description: "Please let us know you want this features.",
          })
        }
        return
      }

      try {
        const { status } = await MailComposer.composeAsync({
          subject: "Hello!",
          body: `Hey, ${contactName}`,
          recipients: [contactEmail],
          // isHtml: true,
        })
        if (status === "sent") {
          toast.success({
            title: "Sent!",
          })
        } else {
          toast.warning({
            title: "Email didnt send",
          })
        }
      } catch (e) {
        toast.warning({
          title: "Email failed",
        })
      }
    }, [])

    const handleOnViewContact = React.useCallback(
      ({ contactName, contactId }: ContactsStackParamList["ContactDetail"]) => {
        navigation.navigate("ContactDetail", {
          contactName,
          contactId,
        })
      },
      [],
    )

    const handleOnText = React.useCallback(
      (contactName: string, contactNumber: string) => {
        const conversationId = getConversationId(userNumber, contactNumber)

        navigation.getParent()?.navigate("ConversationStream", {
          contactName,
          conversationId,
        })
      },
      [userNumber],
    )

    const checkCapabilitiesAsync = async () => {
      const isAvailable = await MailComposer.isAvailableAsync()
      setIsEmailEnabled(isAvailable)
    }

    const extractContactId = React.useCallback((item: IContactListItemData) => item.contactId, [])

    const renderItem = React.useCallback(({ item }: { item: IContactListItemData }) => {
      return (
        <PureContactListItem
          key={item.contactId}
          {...item}
          onViewContact={handleOnViewContact}
          onEmail={handleOnEmail}
          onText={handleOnText}
        ></PureContactListItem>
      )
    }, [])

    React.useEffect(() => {
      if (dataContacts) {
        const flatDataUpdate: IContactListItemData[] = dataContacts.pages.flatMap((page, idx) =>
          page.records.flatMap((contact, idx) => makeContactListItemData(contact)),
        )

        setFlatData(flatDataUpdate)
      }
    }, [dataContacts])

    React.useLayoutEffect(() => {
      // https://reactnavigation.org/docs/native-stack-navigator/#headersearchbaroptions
      navigation.setOptions({
        headerSearchBarOptions: {
          placeholder: "Search name...",
          // hideNavigationBar: false,
          onChangeText: (event) => {
            setContactsSearch(event.nativeEvent.text)
          },
          onOpen: () => {
            contactsStore.setIsHeaderSearchOpen(true)
          },
          onClose: () => {
            contactsStore.setIsHeaderSearchOpen(false)
          },
        },
      })
    }, [navigation])

    React.useEffect(() => {
      let allFilters: IContactFilter[] = []

      if (debouncedContactsSearch) {
        if (debouncedContactsSearch) {
          allFilters.push({
            field: "Searchable",
            operator: "like",
            value: debouncedContactsSearch.toLowerCase(),
          })
        }
        setUseFilters(allFilters)
      }

      setUseFilters(allFilters)
    }, [debouncedContactsSearch])

    React.useEffect(() => {
      contactsStore.setContactsSearch(debouncedContactsSearch)
    }, [debouncedContactsSearch])

    React.useEffect(() => {
      checkCapabilitiesAsync()
    }, [])

    return (
      <Screen
        preset="fixed"
        safeAreaEdges={["top"]}
        statusBarStyle={statusBarColor}
        contentContainerStyle={{
          paddingBottom: 0,
          paddingTop: 0,
        }}
      >
        <View h="full">
          <FlatList
            contentContainerStyle={{
              paddingBottom: 16,
            }}
            contentInsetAdjustmentBehavior="automatic"
            ItemSeparatorComponent={() => <Divider my={spacing.micro} bg="transparent" />}
            data={flatData}
            renderItem={renderItem}
            ListEmptyComponent={
              isLoadingContacts ? (
                <Box px={spacing.tiny} py={spacing.small} h="full">
                  <Text
                    textAlign={"center"}
                    colorToken="text.softer"
                    tx="contacts.loadingContacts"
                  ></Text>
                </Box>
              ) : (
                <Box px={spacing.tiny} py={spacing.small} h="full">
                  <DataStatus
                    title={contactsStore.noDataTitleTx}
                    description={contactsStore.noDataDescriptionTx}
                    icon={contactsStore.noDataIcon}
                    colorScheme={contactsStore.noDataColorScheme}
                  />
                </Box>
              )
            }
            keyExtractor={extractContactId}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            initialNumToRender={10}
          />
        </View>
      </Screen>
    )
  },
)
