import { useHeaderHeight } from "@react-navigation/elements"
import { DrawerActions, useNavigation } from "@react-navigation/native"
import { StatusBar } from "expo-status-bar"
import { observer } from "mobx-react-lite"
import { Divider, FlatList, useColorModeValue, View } from "native-base"
import React, { FC } from "react"
import { StyleSheet, ViewStyle } from "react-native"

import { Screen } from "../../components"
import { useStores } from "../../models"
import {
  ConversationStatusEnum,
  IConversation,
  IConversationStatusUpdate,
  IConversationUpdate,
} from "../../models/Conversation"
import { AppHomeScreenProps } from "../../navigators"
import usePostConversationStatus from "../../services/api/conversations/mutations/usePostConversationStatus"
import useUpdateConversation from "../../services/api/conversations/mutations/useUpdateConversation"
import useListConversations from "../../services/api/conversations/queries/useListConversations"
import { PureConversationListItem } from "./ConversationListItem"

// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../models"

interface IScreenProps extends AppHomeScreenProps<"Conversations"> {}

const Separator = () => <View style={styles.itemSeparator} />

export const ConversationsScreen: FC<IScreenProps> = observer(function ConversationsScreen() {
  const [viewLimit] = React.useState(20)
  const [flatData, setFlatData] = React.useState<IConversation[]>()

  const { conversationStore } = useStores()

  const navigation = useNavigation()

  const headerHeight = useHeaderHeight()

  const statusBarColor = useColorModeValue("dark", "light")

  const [selectedConversationIds, setSelectedConversationIds] = React.useState<string[]>([])

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
    conversationStatus: conversationStore.isViewingUnread ? null : conversationStore.inboxViewEnum,
  })

  const { mutateAsync: mutateAsyncConversation } = useUpdateConversation()

  const { mutateAsync: mutateAsyncStatus, isLoading: isLoadingStatus } = usePostConversationStatus()

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

  const handleOnViewContact = (conversation: IConversation) => {
    alert(conversation.ContactName)
  }
  const handleOnBlock = (conversation: IConversation) => {
    alert(conversation.ContactId)
  }
  const handleOnMarkUnread = async (conversation: IConversation) => {
    const updates: IConversationUpdate = {
      IsRead: false,
    }

    await mutateAsyncConversation({
      conversationId: conversation.ConversationId,
      updates,
    })
  }

  const handleOnMarkRead = async (conversation: IConversation) => {
    const updates: IConversationUpdate = {
      IsRead: true,
    }

    await mutateAsyncConversation({
      conversationId: conversation.ConversationId,
      updates,
    })
  }

  const handleOnMarkComplete = async (conversation: IConversation) => {
    const updates: IConversationStatusUpdate = {
      conversationId: conversation?.ConversationId,
      status: ConversationStatusEnum.CLOSED,
    }

    await mutateAsyncStatus(updates)
  }

  const handleOnMarkActive = async (conversation: IConversation) => {
    const updates: IConversationStatusUpdate = {
      conversationId: conversation?.ConversationId,
      status: ConversationStatusEnum.OPEN,
    }

    await mutateAsyncStatus(updates)
  }

  React.useEffect(() => {
    if (dataConversations) {
      const flatDataUpdate = dataConversations.pages.flatMap((page, idx) =>
        page.records.flatMap((conversation, iidx) => conversation),
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
          renderItem={({ item: conversation }) => (
            <PureConversationListItem
              key={conversation.ConversationId}
              conversation={conversation}
              onViewContact={() => handleOnViewContact(conversation)}
              onBlock={() => handleOnBlock(conversation)}
              onMarkUnread={() => handleOnMarkUnread(conversation)}
              onMarkRead={() => handleOnMarkRead(conversation)}
              onMarkComplete={() => handleOnMarkComplete(conversation)}
              onMarkActive={() => handleOnMarkActive(conversation)}
            ></PureConversationListItem>
          )}
          // ListHeaderComponent={
          //   <FlatListHeaderSearch
          //     onSearch={handleOnSearch}
          //   ></FlatListHeaderSearch>
          // }
          // ListFooterComponent={<Box h={tabBarHeight}></Box>}
          // ListEmptyComponent={<FlatListEmptyComponent></FlatListEmptyComponent>}
          keyExtractor={(item) => item.ConversationId.toString()}
          refreshing={isLoadingConversations || isFetchingConversations}
          // onRefresh={handleRefresh}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          initialNumToRender={10}
          // ItemSeparatorComponent={FlatListItemSeparator}
        />
      </View>
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemSeparator: {
    flex: 1,
    height: 1,
    backgroundColor: "#444",
  },
})
