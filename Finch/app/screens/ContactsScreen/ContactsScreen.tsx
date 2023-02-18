import { DrawerActions, useNavigation } from "@react-navigation/native"
import { StatusBar } from "expo-status-bar"
import { observer } from "mobx-react-lite"
import { Box, Center, Divider, FlatList, Text, useColorModeValue, View } from "native-base"
import React, { FC } from "react"
import { StyleSheet, ViewStyle } from "react-native"

import { Screen } from "../../components"
import { IBlockedNumberCreate } from "../../models/BlockedNumber"
import { IContact, IContactFilter } from "../../models/Contact"
import { AppHomeScreenProps } from "../../navigators"
import useCreateBlockedNumber from "../../services/api/blockednumbers/mutations/useCreateBlockedNumber"
import useListContacts from "../../services/api/contacts/queries/useListContacts"
import usePostConversationStatus from "../../services/api/conversations/mutations/usePostConversationStatus"
import useUpdateConversation from "../../services/api/conversations/mutations/useUpdateConversation"
import { useCustomToast } from "../../utils/useCustomToast"
import { PureContactListItem } from "./ContactListItem"

// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../models"

interface IScreenProps extends AppHomeScreenProps<"Conversations"> {}

const FlatListEmptyComponent = () => {
  return (
    <Box p={4}>
      <Center>
        <Text
          _dark={{ color: "gray.500" }}
          _light={{ color: "gray.400" }}
          fontFamily="mono"
          textTransform="uppercase"
          fontWeight="bold"
        >
          No Data
        </Text>
      </Center>
    </Box>
  )
}

const Separator = () => <View style={styles.itemSeparator} />

export const ContactsScreen: FC<IScreenProps> = observer(function ContactsScreen() {
  const [viewLimit] = React.useState(25)
  const [useFilters, setUseFilters] = React.useState<IContactFilter[] | undefined>([])
  const [flatData, setFlatData] = React.useState<IContact[]>()

  const navigation = useNavigation()

  const toast = useCustomToast()

  const statusBarColor = useColorModeValue("dark", "light")

  const {
    data: dataContacts,
    isError,
    isLoading,
    hasPrevious,
    hasNext,
    currentPage,
    isFetching,
    onRefresh,
    refetch,
    getNext,
    getPrevious,
  } = useListContacts(viewLimit, useFilters)

  const { mutateAsync: mutateAsyncCreateBlockednumber, isLoading: isLoadingBlockednumber } =
    useCreateBlockedNumber()

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
    if (!isFetching && hasNext) {
      getNext()
    }
  }

  const handleOnViewContact = (contact: IContact) => {
    alert(contact.FirstName)
  }

  const handleOnBlock = async (contact: IContact) => {
    const contactNumber = contact?.Phone

    const updates: IBlockedNumberCreate = {
      Number: contactNumber,
      Reason: "unsubscribed",
    }

    await mutateAsyncCreateBlockednumber(updates)

    toast.success({ title: "Blocked" })
  }

  React.useEffect(() => {
    if (dataContacts) {
      const flatDataUpdate = dataContacts.records

      setFlatData(flatDataUpdate)
    }
  }, [dataContacts])

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
          renderItem={({ item: contact }) => (
            <PureContactListItem
              key={contact.ContactId}
              contact={contact}
              onViewContact={() => handleOnViewContact(contact)}
              onBlock={() => handleOnBlock(contact)}
            ></PureContactListItem>
          )}
          // ListHeaderComponent={
          //   <FlatListHeaderSearch
          //     onSearch={handleOnSearch}
          //   ></FlatListHeaderSearch>
          // }
          // ListFooterComponent={<Box h={tabBarHeight}></Box>}
          ListEmptyComponent={<FlatListEmptyComponent></FlatListEmptyComponent>}
          keyExtractor={(item) => item.ContactId.toString()}
          refreshing={isLoading || isFetching}
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
