import { useHeaderHeight } from "@react-navigation/elements"
import { DrawerActions, useNavigation } from "@react-navigation/native"
import { StatusBar } from "expo-status-bar"
import { observer } from "mobx-react-lite"
import { Divider, FlatList, useColorModeValue, View } from "native-base"
import React, { FC } from "react"

import { Screen } from "../../components"
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
import { useCustomToast } from "../../utils/useCustomToast"
import {
  IConversationListItem,
  IConversationListItemData,
  makeConversationListItemData,
  PureConversationListItem,
} from "./ConversationListItem"
import { ConversationStackScreenProps } from "./ConversationsStack"

// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../models"

export const InboxScreen: FC<ConversationStackScreenProps<"Inbox">> = observer(
  function InboxScreen() {
    const [viewLimit] = React.useState(15)
    const [flatData, setFlatData] = React.useState<IConversationListItemData[]>()

    const { conversationStore } = useStores()

    const navigation = useNavigation()

    const headerHeight = useHeaderHeight()
    const toast = useCustomToast()

    const statusBarColor = useColorModeValue("dark", "light")

    const {
      data: dataConversations,
      isFetching: isFetchingConversations,
      isLoading: isLoadingConversations,
      isFetchingNextPage,
      fetchNextPage,
      refetch,
      hasNextPage,
    } = useListConversations({
      pageLimit: viewLimit,
      search: null,
      isUnread: conversationStore.isViewingUnread,
      fromFolderId: null,
      conversationStatus: conversationStore.isViewingUnread
        ? null
        : conversationStore.inboxViewEnum,
    })

    const { mutateAsync: mutateAsyncCreateBlockednumber, isLoading: isLoadingBlockednumber } =
      useCreateBlockedNumber()

    const { mutateAsync: mutateAsyncConversation } = useUpdateConversation()

    const { mutateAsync: mutateAsyncStatus, isLoading: isLoadingStatus } =
      usePostConversationStatus()

    const setConversationUrl = () => {}

    const handleOnPressSettings = () => {
      navigation.dispatch(DrawerActions.toggleDrawer())
    }

    const handleRefresh = () => {
      refetch()
    }

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

    const handleOnViewContact = React.useCallback((contactId: string) => {
      alert(contactId)
    }, [])

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

    const extractConversationId = React.useCallback(
      (item: IConversationListItem) => `${item.conversationId}-${item.createdTime}`,
      [],
    )

    const renderItem = React.useCallback(({ item }: { item: IConversationListItemData }) => {
      return (
        <PureConversationListItem
          key={item.conversationId}
          {...item}
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

    return (
      <Screen
        preset="fixed"
        safeAreaEdges={["top"]}
        contentContainerStyle={{
          paddingBottom: 0,
          // paddingTop: headerHeight,
        }}
      >
        <StatusBar style={statusBarColor} />

        <View h="full">
          <FlatList
            contentInsetAdjustmentBehavior="automatic"
            ItemSeparatorComponent={() => <Divider bg="transparent" />}
            // bg={bgColor}
            data={flatData}
            renderItem={renderItem}
            // ListHeaderComponent={
            //   <FlatListHeaderSearch
            //     onSearch={handleOnSearch}
            //   ></FlatListHeaderSearch>
            // }
            // ListFooterComponent={<Box h={tabBarHeight}></Box>}
            // ListEmptyComponent={<FlatListEmptyComponent></FlatListEmptyComponent>}
            keyExtractor={extractConversationId}
            // refreshing={isLoadingConversations || isFetchingConversations}
            // onRefresh={handleRefresh}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            initialNumToRender={10}
            // ItemSeparatorComponent={FlatListItemSeparator}
          />
        </View>
      </Screen>
    )
  },
)
