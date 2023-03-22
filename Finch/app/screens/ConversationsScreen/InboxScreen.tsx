import { NavigationProp } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import { Box, Divider, FlatList, useColorModeValue, View } from "native-base"
import React, { FC } from "react"
import { useDebounce } from "use-debounce"

import { AlertDialog, useDisclose } from "native-base"
import { Button, ButtonGroup, Screen, Text } from "../../components"
import { DataStatus } from "../../components/DataStatus"
import { useStores } from "../../models"
import { IBlockedNumberCreate } from "../../models/BlockedNumber"
import {
  ConversationStatusEnum,
  IConversationStatusUpdate,
  IConversationUpdate,
} from "../../models/Conversation"
import { AppStackParamList } from "../../navigators"
import useCreateBlockedNumber from "../../services/api/blockednumbers/mutations/useCreateBlockedNumber"
import usePostConversationStatus from "../../services/api/conversations/mutations/usePostConversationStatus"
import useUpdateConversation from "../../services/api/conversations/mutations/useUpdateConversation"
import useListConversations from "../../services/api/conversations/queries/useListConversations"
import { spacing } from "../../theme"
import { useColor } from "../../theme/useColor"
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
  const [blockCreate, setBlockCreate] = React.useState<IBlockedNumberCreate>()
  const cancelRef = React.useRef<any>(null)

  const { conversationStore } = useStores()

  const { navigation } = _props

  const toast = useCustomToast()

  const bgColor = useColor("bg.high")
  const statusBarColor = useColorModeValue("dark", "light")

  const [conversationSearch, setConversationSearch] = React.useState("")

  const [debouncedConversationSearch] = useDebounce(conversationSearch, 750)
  const {
    isOpen: isOpenConfirmBlock,
    onOpen: onOpenConfirmBlock,
    onClose: onCloseConfirmBlock,
  } = useDisclose()

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
    ({ contactName, contactId }: AppStackParamList["ContactDetail"]) => {
      const nav = navigation.getParent<NavigationProp<any>>()

      nav.navigate("ContactDetail", {
        contactName,
        contactId,
      })
    },
    [],
  )

  const handleOnBlock = React.useCallback(async (contactNumber: string) => {
    const updates: IBlockedNumberCreate = {
      Number: contactNumber,
      Reason: "unsubscribed",
    }

    setBlockCreate(updates)
    onOpenConfirmBlock()
  }, [])

  const handleOnCancelBlock = async () => {
    setBlockCreate(undefined)
    onCloseConfirmBlock()
  }

  const handleOnConfirmBlock = async () => {
    if (blockCreate) {
      try {
        await mutateAsyncCreateBlockednumber(blockCreate)
        toast.success({ title: "Blocked", description: blockCreate.Number })
      } catch (e) {
        toast.error({ title: "Failed to block" })
      }
    }

    onCloseConfirmBlock()
  }

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
      navigation.getParent().navigate("ConversationStream", {
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
    <Screen preset="fixed">
      <View h="full">
        <FlatList
          contentContainerStyle={{
            paddingTop: spacing.small,
            paddingBottom: spacing.small,
          }}
          contentInsetAdjustmentBehavior="automatic"
          ItemSeparatorComponent={() => <Divider my={spacing.micro} bg="transparent" />}
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
      {/* <Fab
        renderInPortal={false}
        shadow={0}
        p={3}
        rounded="full"
        icon={<Icon color="white" size={28} icon="chatBubbleOvalLeftEllipsis" />}
      /> */}
      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={isOpenConfirmBlock}
        onClose={onCloseConfirmBlock}
      >
        <AlertDialog.Content bg={bgColor}>
          <AlertDialog.Header borderBottomWidth={0} bg={bgColor}>
            <Box>
              <Text preset="subheading" textAlign="center" tx="common.areYouSure"></Text>
            </Box>
          </AlertDialog.Header>
          <AlertDialog.Footer bg={bgColor}>
            <ButtonGroup size="sm" space={2} justifyContent="space-between" flex={1}>
              <Button onPress={handleOnCancelBlock}>Cancel</Button>
              <Button colorScheme="danger" onPress={handleOnConfirmBlock}>
                Yes, block
              </Button>
            </ButtonGroup>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </Screen>
  )
})
