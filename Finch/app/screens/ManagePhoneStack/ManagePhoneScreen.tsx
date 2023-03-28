import { observer } from "mobx-react-lite"
import { Box, FlatList, Stack, useColorModeValue, View } from "native-base"
import React, { FC } from "react"

import { Icon, IconProps, Screen, Text, TextProps } from "../../components"
import { useCustomToast } from "../../utils/useCustomToast"

import { translate } from "../../i18n"
import { ColorOption, spacing } from "../../theme"

import { ImageBackground } from "react-native"
import { LibraryRoomPressable } from "../LibraryScreen/LibraryRoomPressable"
import { ManagePhoneStackParamList, ManagePhoneStackScreenProps } from "./ManagePhoneStack"

const imgLightSrc = require("../../../assets/images/img-lattice-fade-light.png")
const imgDarkSrc = require("../../../assets/images/img-lattice-fade-dark.png")

interface ISectionDataItem {
  icon: IconProps["icon"]
  tx: TextProps["tx"]
  navigateScreen?: keyof ManagePhoneStackParamList
  colorScheme?: ColorOption
  isSoon?: boolean
  isNew?: boolean
}

const LIBRARY_LINKS: ISectionDataItem[] = [
  {
    icon: "phone",
    tx: "phoneSettings.phoneDetails",
    colorScheme: "gray",
    navigateScreen: "PhoneDetails",
  },
  {
    icon: "scale",
    tx: "phoneSettings.compliance",
    colorScheme: "rose",
    navigateScreen: "Compliance",
  },
  {
    icon: "phoneArrowUpRight",
    tx: "phoneSettings.callForwarding",
    colorScheme: "emerald",
    navigateScreen: "Callforwarding",
  },
  {
    icon: "clock",
    tx: "phoneSettings.businessHours",
    colorScheme: "blue",
    navigateScreen: "BusinessHours",
    isNew: true,
  },
  {
    icon: "bolt",
    tx: "phoneSettings.autoReplies",
    colorScheme: "amber",
    navigateScreen: "AutoReplies",
    isNew: true,
  },
  {
    icon: "inbox",
    tx: "phoneSettings.voicemail",
    navigateScreen: "Voicemail",
    colorScheme: "fuchsia",
  },
]

export const ManagePhoneScreen: FC<ManagePhoneStackScreenProps<"ManagePhone">> = observer(
  function ManagePhoneScreen(_props) {
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
          // colorScheme={item.isSoon ? "gray" : item.colorScheme}
        />
      )
    }, [])

    const renderHeader = React.useCallback(() => {
      return (
        <ImageBackground source={imgSrc} resizeMode="cover">
          <View w="full" py={spacing.small}>
            <Stack space={1} px={spacing.tiny} rounded="md" alignItems="center">
              <Icon colorToken={"text.softer"} size={32} icon="phone" />
              <Text
                textAlign={"center"}
                fontWeight="bold"
                fontSize="2xl"
                tx={"phoneSettings.pageHeader"}
              ></Text>
              <Text
                textAlign={"center"}
                colorToken="text.soft"
                tx={"phoneSettings.pageSubheader"}
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
              // paddingHorizontal: spacing.extraSmall,
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
