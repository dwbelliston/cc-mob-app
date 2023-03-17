import { observer } from "mobx-react-lite"
import { Box, Divider, FlatList, HStack, Pressable, useColorModeValue, View } from "native-base"
import React, { FC } from "react"
import { useDebounce } from "use-debounce"

import { Icon, Screen, Text } from "../../components"
import { Butter } from "../../components/Butter"
import { DataStatus } from "../../components/DataStatus"
import { translate } from "../../i18n"
import { useStores } from "../../models"
import { IBlockedNumber } from "../../models/BlockedNumber"
import useListBlockedNumbers from "../../services/api/blockednumbers/queries/useListBlockedNumbers"
import { spacing } from "../../theme"
import { runFormatTimeFromNow } from "../../utils/useFormatDate"
import { runFormatPhoneSimple } from "../../utils/useFormatPhone"

import { SettingsStackScreenProps } from "./SettingsStack"

interface IBlockedNumberDataItem {
  id: IBlockedNumber["BlockedNumberId"]
  number: IBlockedNumber["Number"]
  created: string
}

export const BlockedScreen: FC<SettingsStackScreenProps<"Blocked">> = observer(
  function BlockedScreen(_props) {
    const {
      authenticationStore: { logout },
    } = useStores()

    const statusBarColor = useColorModeValue("dark", "light")
    const [flatData, setFlatData] = React.useState<IBlockedNumberDataItem[]>()

    const { conversationStore } = useStores()

    const { navigation } = _props

    const [blockedSearch, setBlockedSearch] = React.useState("")

    const [debouncedblockedSearch] = useDebounce(blockedSearch, 750)

    const {
      data: dataBlockedNumbers,
      isFetching: isFetchingNumbers,
      isLoading: isLoadingNumbers,
      fetchNextPage,
    } = useListBlockedNumbers(debouncedblockedSearch)

    const handleLoadMore = () => {
      if (!isFetchingNumbers) {
        if (dataBlockedNumbers?.pages) {
          const lastPage = dataBlockedNumbers?.pages.length - 1

          if (dataBlockedNumbers?.pages[lastPage].meta.cursor) {
            fetchNextPage()
          }
        }
      }
    }

    const extractConversationId = React.useCallback((item: IBlockedNumberDataItem) => item.id, [])

    const renderItem = React.useCallback(({ item }: { item: IBlockedNumberDataItem }) => {
      return (
        <View w="full">
          <Pressable
            onPress={() => {
              // handleOnItemPress(item)
            }}
          >
            <HStack
              justifyContent="space-between"
              py={spacing.micro}
              px={spacing.tiny}
              alignItems="center"
            >
              <HStack flex={2} space={spacing.micro} alignItems="center">
                <Icon colorToken={"text.softer"} size={16} icon={"hashtag"}></Icon>

                <Text flex={1} text={item.number}></Text>
              </HStack>

              <Text
                textAlign="right"
                noOfLines={1}
                fontSize="xs"
                colorToken={"text.softer"}
                text={item.created}
              ></Text>
            </HStack>
          </Pressable>
        </View>
      )
    }, [])

    React.useEffect(() => {
      if (dataBlockedNumbers) {
        const flatDataUpdate: IBlockedNumberDataItem[] = dataBlockedNumbers.pages.flatMap(
          (page, idx) =>
            page.records.flatMap((blockedNumber, idx) => {
              return {
                id: blockedNumber.BlockedNumberId,
                number: runFormatPhoneSimple(blockedNumber.Number),
                created: runFormatTimeFromNow(blockedNumber.CreatedTime),
              }
            }),
        )

        setFlatData(flatDataUpdate)
      }
    }, [dataBlockedNumbers])

    React.useLayoutEffect(() => {
      // https://reactnavigation.org/docs/native-stack-navigator/#headersearchbaroptions
      navigation.setOptions({
        headerSearchBarOptions: {
          placeholder: "Search number...",
          // hideNavigationBar: false,
          onChangeText: (event) => {
            setBlockedSearch(event.nativeEvent.text)
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
      conversationStore.setInboxSearch(debouncedblockedSearch)
    }, [debouncedblockedSearch])

    return (
      <Screen preset="fixed" safeAreaEdges={["top"]} statusBarStyle={statusBarColor}>
        <View h="full">
          <FlatList
            contentContainerStyle={{
              paddingTop: 16,
              paddingBottom: 16,
            }}
            contentInsetAdjustmentBehavior="automatic"
            ItemSeparatorComponent={() => <Divider my={spacing.micro} bg="transparent" />}
            data={flatData}
            renderItem={renderItem}
            ListHeaderComponent={
              !isLoadingNumbers && flatData?.length ? (
                <Box px={spacing.tiny} pb={spacing.tiny}>
                  <Butter.Info
                    titleText={{ tx: "settings.blockedNumbersReachOut" }}
                    descriptionText={{ tx: "settings.blockedNumbersReachOutMore", fontSize: "xs" }}
                  ></Butter.Info>
                </Box>
              ) : null
            }
            ListEmptyComponent={
              isLoadingNumbers ? (
                <Box px={spacing.tiny} py={spacing.small} h="full">
                  <Text textAlign={"center"} colorToken="text.softer" tx="common.oneMoment"></Text>
                </Box>
              ) : (
                <Box px={spacing.tiny} py={spacing.small} h="full">
                  <DataStatus
                    title={translate("settings.noBlockedNumbers")}
                    description={translate("settings.noBlockedNumbersDescription")}
                    icon={"noSymbol"}
                    colorScheme={"gray"}
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
  },
)
