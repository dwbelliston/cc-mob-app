import { observer } from "mobx-react-lite"
import { Box, FlatList, Stack, useColorModeValue, View } from "native-base"
import React, { FC } from "react"

import { Icon, IconProps, Screen, Text, TextProps } from "../../components"
import { useCustomToast } from "../../utils/useCustomToast"

import { translate } from "../../i18n"
import { ColorOption, spacing } from "../../theme"

import { ImageBackground } from "react-native"
import { LibraryRoomPressable } from "../LibraryScreen/LibraryRoomPressable"
import { ManageContactsStackParamList, ManageContactsStackScreenProps } from "./ManageContactsStack"

const imgLightSrc = require("../../../assets/images/img-lattice-fade-light.png")
const imgDarkSrc = require("../../../assets/images/img-lattice-fade-dark.png")

interface ISectionDataItem {
  icon: IconProps["icon"]
  tx: TextProps["tx"]
  navigateScreen?: keyof ManageContactsStackParamList
  colorScheme?: ColorOption
  isSoon?: boolean
  isNew?: boolean
}

const LIBRARY_LINKS: ISectionDataItem[] = [
  {
    icon: "rectangleStack",
    tx: "contacts.directory",
    colorScheme: "gray",
    navigateScreen: "ContactsList",
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
    colorScheme: "emerald",
    navigateScreen: "CrmSync",
    isNew: true,
  },
  {
    icon: "tag",
    tx: "contacts.tags",
    colorScheme: "blue",
    isSoon: true,
  },
  {
    icon: "funnel",
    tx: "contacts.segments",
    colorScheme: "indigo",
    isSoon: true,
  },
  {
    icon: "cloudArrowUp",
    tx: "contacts.uploads",
    colorScheme: "amber",
    isSoon: true,
  },

  {
    icon: "clock",
    colorScheme: "fuchsia",
    tx: "contacts.history",
    navigateScreen: "CrmSync",
    isSoon: true,
  },
]

export const ManageContactsScreen: FC<ManageContactsStackScreenProps<"ManageContacts">> = observer(
  function ManageContactsScreen(_props) {
    const { navigation } = _props

    const toast = useCustomToast()

    const imgSrc = useColorModeValue(imgLightSrc, imgDarkSrc)

    const renderItem = React.useCallback(({ item }: { item: ISectionDataItem }) => {
      return (
        <LibraryRoomPressable
          onPress={() => {
            handleOnItemPress(item)
          }}
          icon={{ icon: item.icon }}
          label={item.tx}
          colorScheme={item.colorScheme}
          isSoon={item.isSoon}
          isNew={item.isNew}
        />
      )
    }, [])

    const renderHeader = React.useCallback(() => {
      return (
        <ImageBackground source={imgSrc} resizeMode="cover">
          <View w="full" py={spacing.small}>
            <Stack space={1} px={spacing.tiny} rounded="md" alignItems="center">
              <Icon colorToken={"text.softer"} size={32} icon="contacts" />
              <Text
                textAlign={"center"}
                fontWeight="bold"
                fontSize="2xl"
                tx={"contacts.manageContactsHeader"}
              ></Text>
              <Text
                textAlign={"center"}
                colorToken="text.soft"
                tx={"contacts.manageContactsSubheader"}
              ></Text>
            </Stack>
          </View>
        </ImageBackground>
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
        }}
      >
        <Box flex={1}>
          <FlatList
            contentContainerStyle={{
              paddingBottom: spacing.large,
            }}
            data={LIBRARY_LINKS}
            renderItem={renderItem}
            ListHeaderComponent={renderHeader}
            // numColumns={2}
          />
        </Box>
      </Screen>
    )
  },
)
