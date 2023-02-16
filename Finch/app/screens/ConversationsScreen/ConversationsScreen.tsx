import { useHeaderHeight } from "@react-navigation/elements"
import { DrawerActions, useNavigation } from "@react-navigation/native"
import { StatusBar } from "expo-status-bar"
import { observer } from "mobx-react-lite"
import { Divider, FlatList, HStack, useColorModeValue, View } from "native-base"
import React, { FC } from "react"
import { StyleSheet, ViewStyle } from "react-native"

import { Icon, Screen, Text } from "../../components"
import { UserAvatar } from "../../components/UserAvatar"
import { ConversationStatusEnum, IConversation } from "../../models/Conversation"
import { AppHomeScreenProps } from "../../navigators"
import useListConversations from "../../services/api/conversations/queries/useListConversations"
import { spacing } from "../../theme"
import { PureConversationListItem } from "./ConversationListItem"

// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../models"

interface IScreenProps extends AppHomeScreenProps<"Conversations"> {}

const Separator = () => <View style={styles.itemSeparator} />

export const ConversationsScreen: FC<IScreenProps> = observer(function ConversationsScreen() {
  const [viewLimit] = React.useState(25)
  const [flatData, setFlatData] = React.useState<IConversation[]>()

  const navigation = useNavigation()

  const headerHeight = useHeaderHeight()

  const statusBarColor = useColorModeValue("dark", "light")

  const [selectedConversationIds, setSelectedConversationIds] = React.useState<string[]>([])

  const {
    data: dataConversations,
    isFetching,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useListConversations({
    pageLimit: viewLimit,
    search: null,
    isUnread: false,
    fromFolderId: null,
    conversationStatus: ConversationStatusEnum.CLOSED,
  })

  const setConversationUrl = () => {}

  const handleOnPressSettings = () => {
    navigation.dispatch(DrawerActions.toggleDrawer())
  }

  const handleOnViewContact = (conversation: IConversation) => {
    alert(conversation.ContactName)
  }
  const handleOnBlock = (conversation: IConversation) => {
    alert(conversation.ContactId)
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
        paddingTop: headerHeight,
      }}
    >
      <StatusBar style={statusBarColor} />

      <View h="full">
        <HStack
          py={spacing.micro}
          px={spacing.tiny}
          alignItems={"center"}
          justifyContent="space-between"
        >
          <HStack space={spacing.tiny} alignItems={"center"}>
            <UserAvatar onPress={handleOnPressSettings}></UserAvatar>
            <Text colorToken="text" preset="heading" tx="common.inbox" />
          </HStack>
          <Icon icon="menu"></Icon>
        </HStack>

        <FlatList
          ItemSeparatorComponent={() => <Divider bg="transparent" />}
          // bg={bgColor}
          data={flatData}
          renderItem={({ item: conversation }) => (
            <PureConversationListItem
              key={conversation.ConversationId}
              conversation={conversation}
              onViewContact={() => handleOnViewContact(conversation)}
              onBlock={() => handleOnBlock(conversation)}
              // onClickConversation={handleClickConversation}
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
          // refreshing={isLoadingConversations || isFetching}
          // onRefresh={handleRefresh}
          // onEndReached={handleLoadMore}
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
