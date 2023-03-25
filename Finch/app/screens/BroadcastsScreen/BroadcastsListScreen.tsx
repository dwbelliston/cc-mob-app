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
          icon={<Icon color="white" size={28} icon="plus" />}
        />
      </Screen>
    )
  },
)
