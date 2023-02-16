import { useHeaderHeight } from "@react-navigation/elements"
import { DrawerActions, useNavigation } from "@react-navigation/native"
import { StatusBar } from "expo-status-bar"
import { observer } from "mobx-react-lite"
import { HStack, Stack, useColorModeValue, View } from "native-base"
import React, { FC } from "react"
import { ViewStyle } from "react-native"
import { Icon, Screen, Text } from "../../components"
import { UserAvatar } from "../../components/UserAvatar"
import { ConversationStatusEnum } from "../../models/Conversation"
import { AppHomeScreenProps } from "../../navigators"
import useListConversations from "../../services/api/conversations/queries/useListConversations"
import { spacing } from "../../theme"
import { ConversationCard } from "./ConversationCard"

// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../models"

interface IScreenProps extends AppHomeScreenProps<"Conversations"> {}

export const ConversationsScreen: FC<IScreenProps> = observer(function ConversationsScreen() {
  const [viewLimit] = React.useState(25)

  const navigation = useNavigation()

  const headerHeight = useHeaderHeight()

  const statusBarColor = useColorModeValue("dark", "light")

  const [selectedConversationIds, setSelectedConversationIds] = React.useState<string[]>([])

  const { data, isFetching, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useListConversations(viewLimit, null, null, null, ConversationStatusEnum.OPEN)

  const setConversationUrl = () => {}

  const handleOnPressSettings = () => {
    navigation.dispatch(DrawerActions.toggleDrawer())
  }

  console.log("data", data?.pages)

  return (
    <Screen
      preset="fixed"
      safeAreaEdges={["top"]}
      contentContainerStyle={{
        flex: 1,
        paddingBottom: 24,
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
        <Stack py={4} space={3}>
          {data &&
            data.pages.map((page, idx) => {
              return (
                <Stack space={3} key={idx}>
                  {page.records.map((conversation, idx) => {
                    const isCardSelected = selectedConversationIds.includes(
                      conversation.ConversationId,
                    )

                    return (
                      <ConversationCard
                        key={conversation.ConversationId}
                        conversation={conversation}
                        onClickConversation={setConversationUrl}
                        isSelected={isCardSelected}
                        isShowSelectBox={!!selectedConversationIds.length}
                        onToggleSelected={() => {
                          // handleOnToggleSelectConversation(conversation.ConversationId)
                        }}
                      ></ConversationCard>
                    )
                  })}
                </Stack>
              )
            })}
        </Stack>
      </View>
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}
