import { useHeaderHeight } from "@react-navigation/elements"
import { observer } from "mobx-react-lite"
import { Box, HStack, SectionList, Skeleton, Stack, useColorModeValue } from "native-base"
import React, { FC } from "react"

import { Screen, Text } from "../../components"
import { DataStatus } from "../../components/DataStatus"
import { translate } from "../../i18n"
import { useStores } from "../../models"
import { ICall } from "../../models/Call"
import {
  IConversationItem,
  IConversationUpdate,
  getConversationContactNumber,
} from "../../models/Conversation"
import { IMessage } from "../../models/Message"
import { AppStackScreenProps } from "../../navigators"
import usePostConversationViewed from "../../services/api/conversations/mutations/usePostConversationViewed"
import useUpdateConversation from "../../services/api/conversations/mutations/useUpdateConversation"
import useListConversationStream from "../../services/api/conversations/queries/useListConversationStream"
import { useReadConversation } from "../../services/api/conversations/queries/useReadConversation"
import { colors, spacing } from "../../theme"
import { runFormatLongTime } from "../../utils/useFormatDate"
import ConversationDivider from "./ConversationDivider"
import {
  PureConversationStreamItem,
  makeConversationStreamItemCall,
  makeConversationStreamItemMessage,
} from "./ConversationStreamItem"
import { NumberScheduledMessagesButton } from "./NumberScheduledMessagesButton"
import SendMessageFloaterInput from "./SendMessageFloaterInput"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../models"

export const ConversationStreamScreen: FC<AppStackScreenProps<"ConversationStream">> = observer(
  function ConversationStreamScreen(_props) {
    const [sectionConversationItems, setSectionConversationItems] = React.useState<any>([])
    const [contactId, setContactId] = React.useState("")
    const [contactNumber, setContactNumber] = React.useState("")
    const [refetchInterval, setRefetchInterval] = React.useState(5000)

    // React.useState<SectionListProps<any, any>>()
    // React.useState<SectionBase<IConversationItem[]>>()

    const { conversationStore } = useStores()

    const headerHeight = useHeaderHeight()
    const unreadBg = useColorModeValue("error.200", "error.300")
    const unreadColor = useColorModeValue("error.900", "error.900")
    const bgStream = useColorModeValue(colors.gray[50], colors.gray[900])

    const viewLimit = 15

    const contactName = _props.route.params.contactName
    const conversationId = _props.route.params.conversationId
    const paramContactId = _props.route.params.contactId
    const paramConversationNumber = _props.route.params.conversationNumber

    const { data: dataConversation, isLoading: isLoadingConversation } =
      useReadConversation(conversationId)

    const {
      status,
      data: dataStreamItems,
      error,
      isError,
      isLoading: isLoadingStream,
      isFetching: isFetchingStream,
      isFetchingNextPage,
      isFetchingPreviousPage,
      fetchNextPage,
      fetchPreviousPage,
      hasNextPage,
      hasPreviousPage,
    } = useListConversationStream(
      viewLimit,
      conversationId,
      null,
      refetchInterval,
      // debouncedStreamSearch
    )

    const { mutateAsync: mutateAsyncConversation } = useUpdateConversation()
    const { mutateAsync: mutateAsyncConversationViewed } = usePostConversationViewed()

    const handleOnSent = () => {
      // If a message is sent to a new contact the refetch is set to 0, this turns it back on
      if (!refetchInterval) {
        setRefetchInterval(5000)
      }
    }
    const handleLoadMore = () => {
      if (!isFetchingStream) {
        if (dataStreamItems?.pages) {
          const lastPage = dataStreamItems?.pages.length - 1

          if (dataStreamItems?.pages[lastPage].meta.cursor) {
            fetchNextPage()
          }
        }
      }
    }

    const handleMarkViewed = async () => {
      // Update the viewed status
      if (dataConversation?.ConversationId) {
        await mutateAsyncConversationViewed({
          conversationId: dataConversation?.ConversationId,
        })
      }
    }

    const extractConversationId = React.useCallback((item: IConversationItem) => item.id, [])

    const renderItem = React.useCallback(({ item }: { item: IConversationItem }) => {
      return (
        <PureConversationStreamItem
          key={item.id}
          conversationItem={item}
          // {...item}
          // onViewConversation={handleViewConversation}
          // onMarkActive={handleOnMarkActive}
          // onMarkComplete={handleOnMarkComplete}
          // onBlock={handleOnBlock}
          // onViewContact={handleOnViewContact}
          // onMarkUnread={handleOnMarkUnread}
          // onMarkRead={handleOnMarkRead}
        ></PureConversationStreamItem>
      )
    }, [])

    const renderSectionHeader = React.useCallback(({ section: { title } }) => {
      return <ConversationDivider label={title} />
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

    React.useEffect(() => {
      const markersWithList = {}

      if (dataStreamItems?.pages) {
        dataStreamItems?.pages.forEach((page) => {
          page.records.map((streamItem) => {
            const conversationItemObj: IConversationItem = {}

            const thisMessageDate = runFormatLongTime(streamItem.CreatedTime)

            // if (dateHeadMarker && dateHeadMarker !== thisMessageDate) {
            //   conversationItemObj.dividerText = dateHeadMarker;
            // }

            // Init this day
            let dateList = []
            if (markersWithList[thisMessageDate]) {
              dateList = markersWithList[thisMessageDate]
            } else {
              markersWithList[thisMessageDate] = dateList
            }

            // Add to this data
            if (streamItem.hasOwnProperty("CallId")) {
              // Build conversation item from message
              const callIn = streamItem as ICall
              conversationItemObj.call = makeConversationStreamItemCall(callIn, contactName)
              conversationItemObj.id = `call-${streamItem.CreatedTime}`
            } else {
              // Build conversation item from message
              const messageIn = streamItem as IMessage
              conversationItemObj.message = makeConversationStreamItemMessage(
                messageIn,
                contactName,
              )
              conversationItemObj.id = `message-${streamItem.CreatedTime}`
            }

            dateList.push(conversationItemObj)
          })
        })
      }

      const itemsUpdate = []

      let nextKey = ""
      for (const [key, value] of Object.entries(markersWithList)) {
        itemsUpdate.push({
          title: nextKey,
          data: value,
        })
        nextKey = key
      }

      setSectionConversationItems(itemsUpdate)

      // scrollToMyRef();
    }, [dataStreamItems])

    React.useEffect(() => {
      if (dataConversation) {
        const contactNumber = getConversationContactNumber(dataConversation)
        const contactId = dataConversation?.ContactId
        setContactId(contactId)
        setContactNumber(contactNumber)
      } else {
        if (paramConversationNumber) {
          setContactNumber(paramConversationNumber)
        }
        if (paramContactId) {
          setContactId(paramContactId)
        }
      }
    }, [dataConversation])

    React.useEffect(() => {
      // Mark read if automark on and if not read
      if (conversationStore.isAutoMarkRead && dataConversation && !dataConversation.IsRead) {
        handleOnMarkRead(dataConversation.ConversationId)
      }
    }, [dataConversation])

    React.useEffect(() => {
      // Update the viewed status when we have new messages come in
      handleMarkViewed()
    }, [dataStreamItems])

    React.useEffect(() => {
      if (isError) {
        setRefetchInterval(0)
      }
    }, [isError])

    React.useEffect(() => {
      // If the conversation id changes, allow the auto mark read to start
      conversationStore.setIsAutoMarkRead(true)
    }, [conversationId])

    return (
      <Screen
        preset="fixed"
        safeAreaEdges={["bottom"]}
        style={{
          backgroundColor: bgStream,
        }}
        contentContainerStyle={{
          flex: 1,
        }}
        keyboardOffset={headerHeight}
      >
        {!dataConversation?.IsRead ? (
          <Box bg={unreadBg} py={spacing.micro}>
            <Text
              fontWeight={"semibold"}
              color={unreadColor}
              textAlign={"center"}
              tx="inbox.unread"
            ></Text>
          </Box>
        ) : null}
        <SectionList
          sections={sectionConversationItems}
          inverted={true}
          stickySectionHeadersEnabled={false}
          contentInsetAdjustmentBehavior="automatic"
          // ItemSeparatorComponent={() => <Divider bg="transparent" />}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          ListEmptyComponent={
            (isLoadingStream && !isError) || dataStreamItems?.pages?.length ? (
              <Stack
                px={spacing.tiny}
                py={spacing.tiny}
                h="full"
                space={spacing.tiny}
                justifyContent={"flex-end"}
              >
                <Stack space={spacing.tiny} w="full">
                  <Skeleton w="3/4" rounded={"xl"} h={24}></Skeleton>
                  <HStack space={spacing.micro} alignItems={"center"}>
                    <Skeleton w={8} h={8} rounded={"full"} key="v1-loading-stream-001" />
                    <Skeleton w={10} h={4} rounded={"xl"} key="v1-loading-stream-002" />
                  </HStack>
                </Stack>
                <Stack space={spacing.tiny} alignItems={"flex-end"} w="full">
                  <Skeleton w="3/4" rounded={"xl"} h={24}></Skeleton>
                  <HStack space={spacing.micro} alignItems={"center"}>
                    <Skeleton w={10} h={4} rounded={"xl"} key="v1-loading-stream-001" />
                    <Skeleton w={8} h={8} rounded={"full"} key="v1-loading-stream-002" />
                  </HStack>
                </Stack>
              </Stack>
            ) : (
              <Box px={spacing.tiny} py={spacing.small} h="full">
                <DataStatus
                  title={translate("stream.noMessages")}
                  description={translate("stream.noMessagesDescription")}
                  icon={"chatBubbleLeft"}
                  colorScheme={"gray"}
                />
              </Box>
            )
          }
          ListFooterComponent={
            !isLoadingStream ? (
              <>
                <Box py={spacing.tiny}>
                  {hasNextPage || isFetchingNextPage ? (
                    <Text textAlign={"center"} colorToken="text.soft" tx="common.loading"></Text>
                  ) : (
                    <Text
                      textAlign={"center"}
                      colorToken="text.soft"
                      tx="inbox.startOfConversation"
                    ></Text>
                  )}
                </Box>
              </>
            ) : (
              <></>
            )
          }
          keyExtractor={extractConversationId}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          initialNumToRender={10}
        />
        <NumberScheduledMessagesButton
          contactName={contactName}
          contactNumber={contactNumber}
        ></NumberScheduledMessagesButton>
        <SendMessageFloaterInput
          contactName={contactName}
          contactId={contactId}
          contactNumber={contactNumber}
          onSent={handleOnSent}
        />
      </Screen>
    )
  },
)
