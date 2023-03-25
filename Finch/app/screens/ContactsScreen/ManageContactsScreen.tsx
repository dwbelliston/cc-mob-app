import { observer } from "mobx-react-lite"
import { Box, FlatList, Stack, View } from "native-base"
import React, { FC } from "react"

import { IconProps, Screen, Text, TextProps } from "../../components"
import { useCustomToast } from "../../utils/useCustomToast"

import { translate } from "../../i18n"
import { ColorOption, spacing } from "../../theme"

import { LibraryRoomPressable } from "../LibraryScreen/LibraryRoomPressable"
import { ManageContactsStackParamList, ManageContactsStackScreenProps } from "./ManageContactsStack"

interface ISectionDataItem {
  icon: IconProps["icon"]
  tx: TextProps["tx"]
  navigateScreen?: keyof ManageContactsStackParamList
  colorScheme?: ColorOption
  isSoon?: boolean
}

const LIBRARY_LINKS: ISectionDataItem[] = [
  {
    icon: "tag",
    tx: "contacts.tags",
    colorScheme: "green",
    isSoon: true,
  },
  {
    icon: "funnel",
    tx: "contacts.segments",
    colorScheme: "green",
    isSoon: true,
  },
  {
    icon: "cloudArrowUp",
    tx: "contacts.uploads",
    colorScheme: "green",
    isSoon: true,
  },
  {
    icon: "noSymbol",
    tx: "contacts.blocked",
    colorScheme: "rose",
    navigateScreen: "Blocked",
  },
  {
    icon: "arrowLeftRight",
    tx: "contacts.crmSync",
    colorScheme: "blue",
    navigateScreen: "CrmSync",
  },
  {
    icon: "clock",
    colorScheme: "green",
    tx: "contacts.history",
    navigateScreen: "CrmSync",
    isSoon: true,
  },
]

export const ManageContactsScreen: FC<ManageContactsStackScreenProps<"ManageContacts">> = observer(
  function ManageContactsScreen(_props) {
    const { navigation } = _props

    const toast = useCustomToast()

    const renderItem = React.useCallback(({ item }: { item: ISectionDataItem }) => {
      return (
        <Box p={spacing.micro} flex={1} h="full" minH={48}>
          <LibraryRoomPressable
            flex={1}
            h="full"
            onPress={() => {
              handleOnItemPress(item)
            }}
            icon={{ icon: item.icon }}
            label={item.tx}
            // colorScheme={item.colorScheme}
            colorScheme={item.isSoon ? "gray" : item.colorScheme}
          />
        </Box>
      )
    }, [])

    const renderHeader = React.useCallback(() => {
      return (
        <View w="full" py={spacing.tiny}>
          <Stack space={1} px={spacing.tiny} rounded="md" alignItems="center">
            {/* <Icon colorToken={"text.softer"} size={32} icon="rectangleGroup" /> */}
            <Text
              textAlign={"center"}
              fontWeight="bold"
              fontSize="2xl"
              tx={"contacts.manageContacts"}
            ></Text>
          </Stack>
        </View>
      )
    }, [])

    const handleOnItemPress = async (item: ISectionDataItem) => {
      if (item.isSoon) {
        toast.info({ title: translate("common.supportedSoon") })
      } else if (item.navigateScreen) {
        navigation.navigate(item.navigateScreen)
      }
    }

    return (
      <Screen
        preset="fixed"
        contentContainerStyle={{
          flex: 1,
          paddingHorizontal: spacing.extraSmall,
        }}
      >
        <Box flex={1}>
          <FlatList
            contentContainerStyle={{ paddingBottom: spacing.medium }}
            data={LIBRARY_LINKS}
            renderItem={renderItem}
            ListHeaderComponent={renderHeader}
            numColumns={2}
          />
        </Box>
      </Screen>
    )
  },
)
