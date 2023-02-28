import { NavigationProp } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import { Box, Divider, FlatList, useColorModeValue, View } from "native-base"
import React, { FC } from "react"
import { useDebounce } from "use-debounce"

import { Screen, Text } from "../../components"
import { DataStatus } from "../../components/DataStatus"
import { useStores } from "../../models"
import { IBlockedNumberCreate } from "../../models/BlockedNumber"
import {
  ConversationStatusEnum,
  IConversationStatusUpdate,
  IConversationUpdate,
} from "../../models/Conversation"
import useCreateBlockedNumber from "../../services/api/blockednumbers/mutations/useCreateBlockedNumber"
import usePostConversationStatus from "../../services/api/conversations/mutations/usePostConversationStatus"
import useUpdateConversation from "../../services/api/conversations/mutations/useUpdateConversation"
import useListConversations from "../../services/api/conversations/queries/useListConversations"
import { spacing } from "../../theme"
import { useCustomToast } from "../../utils/useCustomToast"
import {
  IConversationListItem,
  IConversationListItemData,
  makeConversationListItemData,
  PureConversationListItem,
} from "./ConversationListItem"
import { ConversationStackScreenProps } from "./ConversationsStack"

export const InboxScreen: FC<ConversationStackScreenProps<"Inbox">> = observer(function InboxScreen(
  _props,
) {
  const [flatData, setFlatData] = React.useState<IConversationListItemData[]>()

  const { conversationStore } = useStores()

  const { navigation } = _props

  const toast = useCustomToast()

  const statusBarColor = useColorModeValue("dark", "light")

  const [conversationSearch, setConversationSearch] = React.useState("")

  const [debouncedConversationSearch] = useDebounce(conversationSearch, 750)

  const {
    data: dataConversations,
    isFetching: isFetchingConversations,
    isLoading: isLoadingConversations,
    fetchNextPage,
  } = useListConversations({
    pageLimit: conversationStore.viewLimit,
    search: debouncedConversationSearch,
    isUnread: conversationStore.isViewingUnread,
    fromFolderId: null,
    conversationStatus: conversationStore.isViewingUnread ? null : conversationStore.inboxViewEnum,
  })

  const { mutateAsync: mutateAsyncCreateBlockednumber, isLoading: isLoadingBlockednumber } =
    useCreateBlockedNumber()

  const { mutateAsync: mutateAsyncConversation } = useUpdateConversation()

  const { mutateAsync: mutateAsyncStatus, isLoading: isLoadingStatus } = usePostConversationStatus()

  const handleLoadMore = () => {
    if (!isFetchingConversations) {
      if (dataConversations?.pages) {
        const lastPage = dataConversations?.pages.length - 1

        if (dataConversations?.pages[lastPage].meta.cursor) {
          fetchNextPage()
        }
      }
    }
  }

  const handleOnViewContact = React.useCallback(
    (contactId: string, contactName: string, contactColor: string) => {
      const nav = navigation.getParent<NavigationProp<any>>()

      nav.navigate("ContactsStack", {
        screen: "ContactDetail",
        params: {
          contactName,
          contactId,
          contactColor,
        },
      })
    },
    [],
  )

  const handleOnBlock = React.useCallback(async (contactNumber: string) => {
    const updates: IBlockedNumberCreate = {
      Number: contactNumber,
      Reason: "unsubscribed",
    }

    await mutateAsyncCreateBlockednumber(updates)

    toast.success({ title: "Blocked", description: contactNumber })
  }, [])

  const handleOnMarkUnread = React.useCallback(async (conversationId: string) => {
    const updates: IConversationUpdate = {
      IsRead: false,
    }

    await mutateAsyncConversation({
      conversationId: conversationId,
      updates,
    })
  }, [])

  const handleOnMarkRead = React.useCallback(async (conversationId: string) => {
    const updates: IConversationUpdate = {
      IsRead: true,
    }

    await mutateAsyncConversation({
      conversationId: conversationId,
      updates,
    })
  }, [])

  const handleOnMarkComplete = React.useCallback(async (conversationId: string) => {
    const updates: IConversationStatusUpdate = {
      conversationId: conversationId,
      status: ConversationStatusEnum.CLOSED,
    }

    await mutateAsyncStatus(updates)
  }, [])

  const handleOnMarkActive = React.useCallback(async (conversationId: string) => {
    const updates: IConversationStatusUpdate = {
      conversationId,
      status: ConversationStatusEnum.OPEN,
    }

    await mutateAsyncStatus(updates)
  }, [])

  const handleViewConversation = React.useCallback(
    ({ contactName, conversationId }: { contactName: string; conversationId: string }) => {
      navigation.navigate("ConversationDetail", {
        contactName,
        conversationId,
      })
    },
    [],
  )

  const extractConversationId = React.useCallback(
    (item: IConversationListItem) => `${item.conversationId}-${item.createdTime}`,
    [],
  )

  const renderItem = React.useCallback(({ item }: { item: IConversationListItemData }) => {
    return (
      <PureConversationListItem
        key={item.conversationId}
        {...item}
        onViewConversation={handleViewConversation}
        onMarkActive={handleOnMarkActive}
        onMarkComplete={handleOnMarkComplete}
        onBlock={handleOnBlock}
        onViewContact={handleOnViewContact}
        onMarkUnread={handleOnMarkUnread}
        onMarkRead={handleOnMarkRead}
      ></PureConversationListItem>
    )
  }, [])

  React.useEffect(() => {
    if (dataConversations) {
      const flatDataUpdate: IConversationListItemData[] = dataConversations.pages.flatMap(
        (page, idx) =>
          page.records.flatMap((conversation, idx) => makeConversationListItemData(conversation)),
      )

      setFlatData(flatDataUpdate)
    }
  }, [dataConversations])

  React.useLayoutEffect(() => {
    // https://reactnavigation.org/docs/native-stack-navigator/#headersearchbaroptions
    navigation.setOptions({
      headerSearchBarOptions: {
        placeholder: "Search name or number...",
        // hideNavigationBar: false,
        onChangeText: (event) => {
          setConversationSearch(event.nativeEvent.text)
        },
        onOpen: () => {
          conversationStore.setIsHeaderSearchOpen(true)
        },
        onClose: () => {
          conversationStore.setIsHeaderSearchOpen(false)
        },
      },
    })
  }, [navigation])

  React.useEffect(() => {
    conversationStore.setInboxSearch(debouncedConversationSearch)
  }, [debouncedConversationSearch])

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
          contentInsetAdjustmentBehavior="automatic"
          ItemSeparatorComponent={() => <Divider bg="transparent" />}
          data={flatData}
          renderItem={renderItem}
          ListEmptyComponent={
            isLoadingConversations ? (
              <Box px={spacing.tiny} py={spacing.small} h="full">
                <Text textAlign={"center"} colorToken="text.softer" tx="common.oneMoment"></Text>
              </Box>
            ) : (
              <Box px={spacing.tiny} py={spacing.small} h="full">
                <DataStatus
                  title={conversationStore.noDataTitleTx}
                  description={conversationStore.noDataDescriptionTx}
                  icon={conversationStore.noDataIcon}
                  colorScheme={conversationStore.noDataColorScheme}
                />
              </Box>
            )
          }
          keyExtractor={extractConversationId}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          initialNumToRender={10}
        />
      </View>
    </Screen>
  )
})
