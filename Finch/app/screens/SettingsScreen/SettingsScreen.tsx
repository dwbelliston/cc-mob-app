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
  action: string
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
        action: "",
      },
      {
        icon: "phone",
        tx: "settings.myPhone",
        action: "",
      },
      {
        icon: "creditCard",
        tx: "settings.mySubcription",
        action: "",
      },
    ],
  },
  {
    titleTx: "settings.contacts",
    data: [
      {
        icon: "tag",
        tx: "settings.tags",
        action: "",
      },
      {
        icon: "funnel",
        tx: "settings.segments",
        action: "",
      },
      {
        icon: "cloudArrowUp",
        tx: "settings.uploads",
        action: "",
      },
      {
        icon: "noSymbol",
        tx: "settings.blocked",
        action: "",
        navigateScreen: "Blocked",
      },
      {
        icon: "clock",
        tx: "settings.history",
        action: "",
      },
    ],
  },
  {
    titleTx: "settings.library",
    data: [
      {
        icon: "chatBubbleBottomCenterText",
        tx: "settings.smsTemplates",
        action: "",
      },
      {
        icon: "photo",
        tx: "settings.savedMedia",
        action: "",
      },
      {
        icon: "link",
        tx: "settings.shortUrls",
        action: "",
      },
    ],
  },
  {
    titleTx: "settings.currentClient",
    data: [
      {
        icon: "lifebuoy",
        tx: "settings.helpCenter",
        action: "",
      },
      {
        icon: "shieldCheck",
        tx: "settings.privacy",
        action: "",
      },
      {
        icon: "star",
        tx: "settings.leaveReview",
        action: "",
      },
      {
        icon: "arrow-left-on-rectangle",
        tx: "settings.logOut",
        action: "",
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
