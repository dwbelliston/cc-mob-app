import { observer } from "mobx-react-lite"
import { Box, FlatList, Stack, useColorModeValue, View } from "native-base"
import React, { FC } from "react"

import { Icon, IconProps, Screen, Text, TextProps } from "../../components"
import { useCustomToast } from "../../utils/useCustomToast"

import { ImageBackground } from "react-native"
import { translate } from "../../i18n"
import { ColorOption, spacing } from "../../theme"
import { LibraryRoomPressable } from "./LibraryRoomPressable"
import { LibraryStackParamList, LibraryStackScreenProps } from "./LibraryStack"

const imgLightSrc = require("../../../assets/images/img-lattice-fade-light.png")
const imgDarkSrc = require("../../../assets/images/img-lattice-fade-dark.png")

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
    icon: "squares2X2",
    tx: "library.templateGallery",
    navigateScreen: "TemplateGallery",
    colorScheme: "indigo",
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

    const imgSrc = useColorModeValue(imgLightSrc, imgDarkSrc)

    const toast = useCustomToast()

    const renderItem = React.useCallback(({ item }: { item: ISectionDataItem }) => {
      return (
        <LibraryRoomPressable
          onPress={() => {
            handleOnItemPress(item)
          }}
          icon={{ icon: item.icon }}
          label={item.tx}
          colorScheme={item.colorScheme}
          // colorScheme={item.isSoon ? "gray" : item.colorScheme}
        />
      )
    }, [])

    const renderHeader = React.useCallback(() => {
      return (
        <ImageBackground source={imgSrc} resizeMode="cover">
          <View w="full" py={spacing.small}>
            <Stack space={1} px={spacing.tiny} rounded="md" alignItems="center">
              <Icon colorToken={"text.softer"} size={32} icon="rectangleGroup" />
              <Text
                textAlign={"center"}
                fontWeight="bold"
                fontSize="2xl"
                tx={"library.libraryHeader"}
              ></Text>
              <Text
                textAlign={"center"}
                colorToken="text.soft"
                tx={"library.librarySubheader"}
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
              paddingBottom: spacing.medium,
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
