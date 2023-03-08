import { useHeaderHeight } from "@react-navigation/elements"
import { observer } from "mobx-react-lite"
import { Box, SectionList, useColorModeValue } from "native-base"
import React, { FC } from "react"

import { StyleSheet, ViewStyle } from "react-native"
import { Screen, Text } from "../../components"
import { DataStatus } from "../../components/DataStatus"
import { translate } from "../../i18n"
import { useStores } from "../../models"
import { ICall } from "../../models/Call"
import {
  getConversationContactNumber,
  IConversationItem,
  IConversationUpdate,
} from "../../models/Conversation"
import { IMessage } from "../../models/Message"
import { AppStackScreenProps } from "../../navigators"
import useReadContact from "../../services/api/contacts/queries/useReadContact"
import useUpdateConversation from "../../services/api/conversations/mutations/useUpdateConversation"
import useListConversationStream from "../../services/api/conversations/queries/useListConversationStream"
import { useReadConversation } from "../../services/api/conversations/queries/useReadConversation"
import { colors, spacing } from "../../theme"
import { runFormatLongTime } from "../../utils/useFormatDate"
import ConversationDivider from "./ConversationDivider"
import {
  makeConversationStreamItemCall,
  makeConversationStreamItemMessage,
  PureConversationStreamItem,
} from "./ConversationStreamItem"
import SendMessageFloaterInput from "./SendMessageFloaterInput"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../models"

export const ConversationStreamScreen: FC<AppStackScreenProps<"ConversationStream">> = observer(
  function ConversationStreamScreen(_props) {
    const [sectionConversationItems, setSectionConversationItems] = React.useState<any>([])
    const [contactNumber, setContactNumber] = React.useState("")
    // React.useState<SectionListProps<any, any>>()
    // React.useState<SectionBase<IConversationItem[]>>()

    const { conversationStore } = useStores()

    const headerHeight = useHeaderHeight()
    const bgStream = useColorModeValue(colors.gray[50], colors.gray[900])

    const viewLimit = 15

    const contactName = _props.route.params.contactName
    const conversationId = _props.route.params.conversationId

    const { data: dataConversation, isLoading: isLoadingConversation } =
      useReadConversation(conversationId)

    const contactId = dataConversation?.ContactId

    const {
      data: dataContact,
      isError: isErrorContact,
      isLoading: isLoadingContact,
    } = useReadContact(contactId)

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
      // debouncedStreamSearch
    )

    const { mutateAsync: mutateAsyncConversation } = useUpdateConversation()

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
      const conversationItemsUpdate: IConversationItem[] = []

      let dateHeadMarker: string = ""

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
        setContactNumber(contactNumber)
      }
    }, [dataConversation])

    React.useEffect(() => {
      if (dataConversation) {
        if (!dataConversation.IsRead) {
          handleOnMarkRead(dataConversation.ConversationId)
        }
      }
    }, [dataConversation])

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
        <SectionList
          sections={sectionConversationItems}
          inverted={true}
          stickySectionHeadersEnabled={false}
          contentInsetAdjustmentBehavior="automatic"
          // ItemSeparatorComponent={() => <Divider bg="transparent" />}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          ListEmptyComponent={
            isLoadingStream ? (
              <Box px={spacing.tiny} py={spacing.small} h="full">
                <Text textAlign={"center"} colorToken="text.softer" tx="common.oneMoment"></Text>
              </Box>
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
        <SendMessageFloaterInput
          contactName={contactName}
          contactId={contactId}
          contactNumber={contactNumber}
        />
      </Screen>
    )
  },
)

const $root: ViewStyle = {
  flex: 1,
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    padding: 24,
    flex: 1,
    justifyContent: "flex-end",
  },
  header: {
    fontSize: 36,
    lineHeight: 36,
    marginBottom: 48,
  },
  input: {
    height: 40,
    borderColor: "#000000",
    borderBottomWidth: 1,
    marginBottom: 36,
  },
  btnContainer: {
    backgroundColor: "white",
    marginTop: 12,
  },
})
