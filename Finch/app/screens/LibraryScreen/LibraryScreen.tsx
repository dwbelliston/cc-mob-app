import { observer } from "mobx-react-lite"
import { Box, FlatList, Stack, View } from "native-base"
import React, { FC } from "react"

import { Icon, IconProps, Screen, Text, TextProps } from "../../components"
import { useStores } from "../../models"
import { useCustomToast } from "../../utils/useCustomToast"

import { translate } from "../../i18n"
import { ColorOption, spacing } from "../../theme"
import { LibraryRoomPressable } from "./LibraryRoomPressable"
import { LibraryStackParamList, LibraryStackScreenProps } from "./LibraryStack"

interface ISectionDataItem {
  icon: IconProps["icon"]
  tx: TextProps["tx"]
  navigateScreen?: keyof LibraryStackParamList
  colorScheme?: ColorOption
  isSoon?: boolean
}

const LIBRARY_LINKS: ISectionDataItem[] = [
  {
    icon: "squaresPlus",
    tx: "library.discoverTemplates",

    colorScheme: "blue",
    isSoon: true,
  },
  {
    icon: "chatBubbleBottomCenterText",
    tx: "library.smsTemplates",
    navigateScreen: "SmsTemplates",
    colorScheme: "amber",
  },
  {
    icon: "link",
    tx: "library.shortUrls",
    // navigateScreen: "TemplateGallery",
    colorScheme: "emerald",
    isSoon: true,
  },
  {
    icon: "squares2X2",
    tx: "library.templateGallery",
    navigateScreen: "TemplateGallery",
    colorScheme: "indigo",
  },
  {
    icon: "photo",
    tx: "library.savedMedia",
    // navigateScreen: "TemplateGallery",
    colorScheme: "rose",
    isSoon: true,
  },

  {
    icon: "identification",
    tx: "library.vcards",
    // navigateScreen: "TemplateGallery",
    colorScheme: "fuchsia",
    isSoon: true,
  },
]

export const LibraryScreen: FC<LibraryStackScreenProps<"Library">> = observer(
  function LibraryScreen(_props) {
    const { navigation } = _props
    const {
      authenticationStore: { logout },
    } = useStores()

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
            colorScheme={item.isSoon ? "gray" : item.colorScheme}
          />
        </Box>
      )
    }, [])

    const renderHeader = React.useCallback(() => {
      return (
        <View w="full" py={spacing.tiny}>
          <Stack space={1} px={spacing.tiny} rounded="md" alignItems="center">
            <Icon colorToken={"text.softer"} size={32} icon="rectangleGroup" />
            <Text
              textAlign={"center"}
              fontWeight="bold"
              fontSize="2xl"
              tx={"library.selectResource"}
            ></Text>
          </Stack>
        </View>
      )
    }, [])

    const handleOnItemPress = async (item: ISectionDataItem) => {
      if (item.navigateScreen) {
        navigation.navigate(item.navigateScreen)
      } else if (item.isSoon) {
        toast.info({ title: translate("common.supportedSoon") })
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
