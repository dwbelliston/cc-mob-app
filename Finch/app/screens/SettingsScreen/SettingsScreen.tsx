import { useHeaderHeight } from "@react-navigation/elements"
import * as Haptics from "expo-haptics"
import { observer } from "mobx-react-lite"
import { Box, HStack, SectionList, useColorModeValue, View } from "native-base"
import React, { FC } from "react"
import { Pressable } from "react-native"

import appConfig from "../../../app-config"
import { Icon, IconProps, Screen, Text, TextProps } from "../../components"
import { useStores } from "../../models"
import { spacing } from "../../theme"
import { useColor } from "../../theme/useColor"

import { SettingsStackParamList, SettingsStackScreenProps } from "./SettingsStack"

interface ISectionDataItem {
  icon: IconProps["icon"]
  tx: TextProps["tx"]
  navigateScreen?: keyof SettingsStackParamList
  colorToken?: TextProps["colorToken"]
}
interface ISectionData {
  titleTx: TextProps["tx"]
  data: ISectionDataItem[]
}

const SETTINGS_LINKS: ISectionData[] = [
  {
    titleTx: "settings.account",
    data: [
      {
        icon: "userCircle",
        tx: "settings.myProfile",
        navigateScreen: "Profile",
      },
      {
        icon: "phone",
        tx: "settings.myPhone",
      },
      {
        icon: "creditCard",
        tx: "settings.mySubcription",
      },
    ],
  },
  {
    titleTx: "settings.contacts",
    data: [
      {
        icon: "tag",
        tx: "settings.tags",
      },
      {
        icon: "funnel",
        tx: "settings.segments",
      },
      {
        icon: "cloudArrowUp",
        tx: "settings.uploads",
      },
      {
        icon: "noSymbol",
        tx: "settings.blocked",

        navigateScreen: "Blocked",
        colorToken: "success",
      },
      {
        icon: "clock",
        tx: "settings.history",
      },
    ],
  },
  {
    titleTx: "settings.library",
    data: [
      {
        icon: "chatBubbleBottomCenterText",
        tx: "settings.smsTemplates",
      },
      {
        icon: "photo",
        tx: "settings.savedMedia",
      },
      {
        icon: "link",
        tx: "settings.shortUrls",
      },
    ],
  },
  {
    titleTx: "settings.currentClient",
    data: [
      {
        icon: "lifebuoy",
        tx: "settings.helpCenter",
      },
      {
        icon: "shieldCheck",
        tx: "settings.privacy",
      },
      {
        icon: "star",
        tx: "settings.leaveReview",
      },
      {
        icon: "arrow-left-on-rectangle",
        tx: "settings.logOut",
        colorToken: "error",
      },
    ],
  },
]

export const SettingsScreen: FC<SettingsStackScreenProps<"Settings">> = observer(
  function SettingsScreen(_props) {
    const { navigation } = _props
    const {
      authenticationStore: { logout },
    } = useStores()

    const statusBarColor = useColorModeValue("dark", "light")
    const bgSectionTitle = useColor("bg.main")

    const appVersion = `App version: ${appConfig.version}`

    const headerHeight = useHeaderHeight()

    // const handleOnViewContact = React.useCallback(
    //   ({ contactName, contactId }: AppStackParamList["ContactDetail"]) => {
    //     navigation.getParent().navigate("ContactDetail", {
    //       contactName,
    //       contactId,
    //     })
    //   },
    //   [],
    // )

    const handleOnItemPress = (item: ISectionDataItem) => {
      Haptics.selectionAsync()
      console.log("item", item)
      if (item.navigateScreen) {
        navigation.navigate(item.navigateScreen)
      }
    }

    const renderItem = React.useCallback(({ item }: { item: ISectionDataItem }) => {
      return (
        <View w="full">
          <Pressable
            onPress={() => {
              handleOnItemPress(item)
            }}
          >
            <HStack
              flex={1}
              justifyContent="space-between"
              py={spacing.tiny}
              px={spacing.tiny}
              alignItems="center"
            >
              {/* Icon */}
              <HStack flex={1} space={spacing.tiny} alignItems="center">
                <Icon colorToken={item.colorToken} size={20} icon={item.icon}></Icon>
                {/* Label */}
                {/* Arror */}
                <Text
                  colorToken={item.colorToken}
                  // fontSize="md"
                  tx={item.tx}
                ></Text>
              </HStack>
              <Icon colorToken={"text.softer"} size={20} icon="chevronRight"></Icon>
            </HStack>
          </Pressable>
        </View>
      )
    }, [])

    const renderFooter = React.useCallback(() => {
      return (
        <View w="full" px={spacing.tiny} py={spacing.tiny}>
          <Text
            colorToken={"text.softer"}
            // fontSize="md"
            text={appVersion}
          ></Text>
        </View>
      )
    }, [])

    const renderSectionHeader = React.useCallback(({ section: { titleTx } }) => {
      return (
        <Text
          bg={bgSectionTitle}
          fontWeight={"semibold"}
          colorToken="text.softer"
          py={spacing.micro}
          px={spacing.tiny}
          tx={titleTx}
        ></Text>
      )
    }, [])

    return (
      <Screen
        preset="fixed"
        safeAreaEdges={["bottom"]}
        // style={{
        //   backgroundColor: bgStream,
        // }}
        contentContainerStyle={{
          flex: 1,
        }}
      >
        <Box
          style={{
            marginTop: headerHeight,
          }}
          flex={1}
        >
          <SectionList
            sections={SETTINGS_LINKS}
            stickySectionHeadersEnabled={true}
            contentInsetAdjustmentBehavior="automatic"
            // ItemSeparatorComponent={() => <Divider bg="transparent" />}
            renderItem={renderItem}
            renderSectionHeader={renderSectionHeader}
            ListFooterComponent={renderFooter}
          />
        </Box>
      </Screen>
    )
  },
)
