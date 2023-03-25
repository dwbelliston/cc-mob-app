import { observer } from "mobx-react-lite"
import { Box, Divider, Fab, FlatList, View } from "native-base"
import React, { FC } from "react"

import { Icon, Screen, Text } from "../../components"
import { DataStatus } from "../../components/DataStatus"
import { useStores } from "../../models"
import useListBroadcasts from "../../services/api/broadcasts/queries/useListBroadcasts"
import { spacing } from "../../theme"
import {
  IBroadcastListItem,
  IBroadcastListItemData,
  makeBroadcastListItemData,
  PureBroadcastListItem,
} from "./BroadcastListItem"

import { BroadcastsStackScreenProps } from "./BroadcastsStack"

export const BroadcastsListScreen: FC<BroadcastsStackScreenProps<"BroadcastsList">> = observer(
  function BroadcastsListScreen(_props) {
    const [flatData, setFlatData] = React.useState<IBroadcastListItemData[]>()
    // const [blockCreate, setBlockCreate] = React.useState<IBlockedNumberCreate>()
    // const cancelRef = React.useRef<any>(null)

    const { broadcastsStore } = useStores()

    const { navigation } = _props

    // const toast = useCustomToast()

    // const bgColor = useColor("bg.high")
    // const statusBarColor = useColorModeValue("dark", "light")

    // const [conversationSearch, setConversationSearch] = React.useState("")

    // const [debouncedConversationSearch] = useDebounce(conversationSearch, 750)
    // const {
    //   isOpen: isOpenConfirmBlock,
    //   onOpen: onOpenConfirmBlock,
    //   onClose: onCloseConfirmBlock,
    // } = useDisclose()

    const {
      data: dataBroadcasts,
      isFetching: isFetchingBroadcasts,
      isLoading: isLoadingBroadcasts,
      fetchNextPage,
    } = useListBroadcasts({
      pageLimit: broadcastsStore.viewLimit,
      status: broadcastsStore.listViewStatusEnum,
    })

    console.log("dataBroadcasts", dataBroadcasts)

    // const { mutateAsync: mutateAsyncCreateBlockednumber, isLoading: isLoadingBlockednumber } =
    //   useCreateBlockedNumber()

    // const { mutateAsync: mutateAsyncConversation } = useUpdateConversation()

    // const { mutateAsync: mutateAsyncStatus, isLoading: isLoadingStatus } = usePostConversationStatus()

    const handleLoadMore = () => {
      if (!isFetchingBroadcasts) {
        if (dataBroadcasts?.pages) {
          const lastPage = dataBroadcasts?.pages.length - 1

          if (dataBroadcasts?.pages[lastPage].meta.cursor) {
            fetchNextPage()
          }
        }
      }
    }

    // const handleOnViewContact = React.useCallback(
    //   ({ contactName, contactId }: AppStackParamList["ContactDetail"]) => {
    //     const nav = navigation.getParent<NavigationProp<any>>()

    //     nav.navigate("ContactDetail", {
    //       contactName,
    //       contactId,
    //     })
    //   },
    //   [],
    // )

    // const handleOnBlock = React.useCallback(async (contactNumber: string) => {
    //   const updates: IBlockedNumberCreate = {
    //     Number: contactNumber,
    //     Reason: "unsubscribed",
    //   }

    //   setBlockCreate(updates)
    //   onOpenConfirmBlock()
    // }, [])

    // const handleOnCancelBlock = async () => {
    //   setBlockCreate(undefined)
    //   onCloseConfirmBlock()
    // }

    // const handleOnConfirmBlock = async () => {
    //   if (blockCreate) {
    //     try {
    //       await mutateAsyncCreateBlockednumber(blockCreate)
    //       toast.success({ title: "Blocked", description: blockCreate.Number })
    //     } catch (e) {
    //       toast.error({ title: "Failed to block" })
    //     }
    //   }

    //   onCloseConfirmBlock()
    // }

    // const handleOnMarkUnread = React.useCallback(async (conversationId: string) => {
    //   const updates: IConversationUpdate = {
    //     IsRead: false,
    //   }

    //   await mutateAsyncConversation({
    //     conversationId: conversationId,
    //     updates,
    //   })
    // }, [])

    // const handleOnMarkRead = React.useCallback(async (conversationId: string) => {
    //   const updates: IConversationUpdate = {
    //     IsRead: true,
    //   }

    //   await mutateAsyncConversation({
    //     conversationId: conversationId,
    //     updates,
    //   })
    // }, [])

    // const handleOnMarkComplete = React.useCallback(async (conversationId: string) => {
    //   const updates: IConversationStatusUpdate = {
    //     conversationId: conversationId,
    //     status: ConversationStatusEnum.CLOSED,
    //   }

    //   await mutateAsyncStatus(updates)
    // }, [])

    // const handleOnMarkActive = React.useCallback(async (conversationId: string) => {
    //   const updates: IConversationStatusUpdate = {
    //     conversationId,
    //     status: ConversationStatusEnum.OPEN,
    //   }

    //   await mutateAsyncStatus(updates)
    // }, [])

    const handleViewBroadcast = React.useCallback(
      ({ title, broadcastId }: { title: string; broadcastId: string }) => {
        navigation.getParent().navigate("BroadcastDetail", {
          broadcastId,
          title,
        })
      },
      [],
    )

    const extractBroadcastId = React.useCallback((item: IBroadcastListItem) => item.BroadcastId, [])

    const renderItem = React.useCallback(({ item }: { item: IBroadcastListItemData }) => {
      return (
        <PureBroadcastListItem
          key={item.BroadcastId}
          {...item}
          onViewBroadcast={handleViewBroadcast}
        ></PureBroadcastListItem>
      )
    }, [])

    React.useEffect(() => {
      if (dataBroadcasts) {
        const flatDataUpdate: IBroadcastListItemData[] = dataBroadcasts.pages.flatMap((page, idx) =>
          page.records.flatMap((broadcast, idx) => makeBroadcastListItemData(broadcast)),
        )

        setFlatData(flatDataUpdate)
      }
    }, [dataBroadcasts])

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
              isLoadingBroadcasts ? (
                <Box px={spacing.tiny} py={spacing.small} h="full">
                  <Text textAlign={"center"} colorToken="text.softer" tx="common.oneMoment"></Text>
                </Box>
              ) : (
                <Box px={spacing.tiny} py={spacing.small} h="full">
                  <DataStatus
                    title={broadcastsStore.noDataTitleTx}
                    description={broadcastsStore.noDataDescriptionTx}
                    icon={broadcastsStore.noDataIcon}
                    colorScheme={broadcastsStore.noDataColorScheme}
                  />
                </Box>
              )
            }
            keyExtractor={extractBroadcastId}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            initialNumToRender={10}
          />
        </View>
        <Fab
          renderInPortal={false}
          shadow={0}
          p={3}
          rounded="full"
          icon={<Icon color="white" size={28} icon="chatBubbleOvalLeftEllipsis" />}
        />
      </Screen>
    )
  },
)
