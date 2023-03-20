import { useHeaderHeight } from "@react-navigation/elements"
import { observer } from "mobx-react-lite"
import { Box, SectionList, View } from "native-base"
import React, { FC } from "react"

import appConfig from "../../../app-config"
import { IconProps, Screen, Text, TextProps } from "../../components"
import { PressableActionRow } from "../../components/PressableActionRow"
import { translate } from "../../i18n"
import { useStores } from "../../models"
import { spacing } from "../../theme"
import { useColor } from "../../theme/useColor"
import { useCustomToast } from "../../utils/useCustomToast"

import { SettingsStackParamList, SettingsStackScreenProps } from "./SettingsStack"

interface ISectionDataItem {
  icon: IconProps["icon"]
  tx: TextProps["tx"]
  navigateScreen?: keyof SettingsStackParamList
  colorToken?: TextProps["colorToken"]
  isLogout?: boolean
  isSoon?: boolean
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
        navigateScreen: "MyPhone",
      },
      {
        icon: "creditCard",
        tx: "settings.mySubscription",
        navigateScreen: "MySubscription",
      },
    ],
  },
  {
    titleTx: "settings.phone",
    data: [
      {
        icon: "scale",
        tx: "settings.compliance",
        navigateScreen: "Compliance",
      },
      {
        icon: "phoneArrowUpRight",
        tx: "settings.callForwarding",
        navigateScreen: "Callforwarding",
      },
      {
        icon: "clock",
        tx: "settings.businessHours",
        navigateScreen: "BusinessHours",
      },
      {
        icon: "bolt",
        tx: "settings.autoReplies",
        navigateScreen: "Compliance",
        colorToken: "text.softer",
        isSoon: true,
      },
      {
        icon: "inbox",
        tx: "settings.voicemail",
        navigateScreen: "Compliance",
        colorToken: "text.softer",
        isSoon: true,
      },
    ],
  },
  {
    titleTx: "settings.contacts",
    data: [
      {
        icon: "tag",
        tx: "settings.tags",
        colorToken: "text.softer",
        isSoon: true,
      },
      {
        icon: "funnel",
        tx: "settings.segments",
        colorToken: "text.softer",
        isSoon: true,
      },
      {
        icon: "cloudArrowUp",
        tx: "settings.uploads",
        colorToken: "text.softer",
        isSoon: true,
      },
      {
        icon: "noSymbol",
        tx: "settings.blocked",

        navigateScreen: "Blocked",
      },
      {
        icon: "arrowLeftRight",
        tx: "settings.crmSync",
        navigateScreen: "CrmSync",
      },
      {
        icon: "clock",
        tx: "settings.history",
        colorToken: "text.softer",
        isSoon: true,
      },
    ],
  },
  {
    titleTx: "settings.library",
    data: [
      {
        icon: "chatBubbleBottomCenterText",
        tx: "settings.smsTemplates",
        navigateScreen: "SmsTemplates",
      },
      {
        icon: "photo",
        tx: "settings.savedMedia",
        colorToken: "text.softer",
        isSoon: true,
      },
      {
        icon: "link",
        tx: "settings.shortUrls",
        colorToken: "text.softer",
        isSoon: true,
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
        isLogout: true,
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

    const toast = useCustomToast()

    const bgSectionTitle = useColor("bg.main")

    const appVersion = `App version: ${appConfig.version}`

    const headerHeight = useHeaderHeight()

    const handleOnItemPress = (item: ISectionDataItem) => {
      if (item.navigateScreen) {
        navigation.navigate(item.navigateScreen)
      } else if (item.isLogout) {
        logout()
      } else if (item.isSoon) {
        toast.info({ title: translate("common.supportedSoon") })
      }
    }

    const renderItem = React.useCallback(({ item }: { item: ISectionDataItem }) => {
      return (
        <PressableActionRow
          onPress={() => {
            handleOnItemPress(item)
          }}
          icon={{ icon: item.icon }}
          tx={item.tx}
          colorToken={item.colorToken}
        />
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
          px={spacing.tiny}
          tx={titleTx}
          py={spacing.micro}
        ></Text>
      )
    }, [])

    return (
      <Screen
        preset="fixed"
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
            renderItem={renderItem}
            renderSectionHeader={renderSectionHeader}
            ListFooterComponent={renderFooter}
            // SectionSeparatorComponent={() => <Divider mt={spacing.small} bg="transparent" />}
          />
        </Box>
      </Screen>
    )
  },
)
