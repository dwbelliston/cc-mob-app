import * as SMS from "expo-sms"
import * as WebBrowser from "expo-web-browser"
import { observer } from "mobx-react-lite"
import { Box, Divider, SectionList, View } from "native-base"
import React, { FC } from "react"

import appConfig from "../../../app-config"
import { IconProps, Screen, Text, TextProps } from "../../components"
import { PressableActionRow } from "../../components/PressableActionRow"
import { translate } from "../../i18n"
import { useStores } from "../../models"
import { spacing } from "../../theme"
import { useColor } from "../../theme/useColor"
import { useCustomToast } from "../../utils/useCustomToast"

import { Linking, Platform } from "react-native"
import useReadUserProfile from "../../services/api/userprofile/queries/useReadUserProfile"
import { SettingsStackParamList, SettingsStackScreenProps } from "./SettingsStack"

const isIos = Platform.OS === "ios"

interface ISectionDataItem {
  icon: IconProps["icon"]
  tx: TextProps["tx"]
  navigateScreen?: keyof SettingsStackParamList
  colorToken?: TextProps["colorToken"]
  isLogout?: boolean
  isSoon?: boolean
  isTextSupport?: boolean
  urlLink?: string
  appLink?: string
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
        icon: "creditCard",
        tx: "settings.mySubscription",
        navigateScreen: "MySubscription",
      },
      {
        icon: "lockClosed",
        tx: "settings.security",
        navigateScreen: "Security",
      },
      {
        icon: "bellAlert",
        tx: "settings.notifications",
        navigateScreen: "Notifications",
      },
    ],
  },
  {
    titleTx: "settings.currentClient",
    data: [
      {
        icon: "handRaised",
        tx: "settings.textSupport",
        isTextSupport: true,
      },
      {
        icon: "lifebuoy",
        tx: "settings.helpCenter",
        urlLink: "https://www.currentclient.com/learn",
        // isSoon: true,
      },
      {
        icon: "shieldCheck",
        tx: "settings.privacy",
        urlLink: "https://www.currentclient.com/privacy",
      },
      {
        icon: "newspaper",
        tx: "settings.blog",
        urlLink: "https://www.currentclient.com/blog",
      },
      {
        icon: "star",
        tx: "settings.leaveReview",
        appLink: isIos
          ? "itms-apps://apps.apple.com/app/id6446603544?action=write-review"
          : "https://play.google.com/store/apps/details?id=com.currentclient.app",
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

    const { data: userProfile } = useReadUserProfile()

    const openAppStore = () => {}

    const handleOnItemPress = async (item: ISectionDataItem) => {
      if (item.navigateScreen) {
        navigation.navigate(item.navigateScreen)
      } else if (item.isLogout) {
        logout()
      } else if (item.isSoon) {
        toast.info({ title: translate("common.supportedSoon") })
      } else if (item.isTextSupport) {
        const isAvailable = await SMS.isAvailableAsync()
        if (isAvailable) {
          let msgSend = "Hey! I would like some help."
          if (userProfile) {
            msgSend = `Hey! This is ${userProfile.FirstName} and I would like some help.`
          }
          await SMS.sendSMSAsync("3853361132", msgSend)
        } else {
          toast.warning({ title: "Not able to text" })
        }
      } else if (item.urlLink) {
        WebBrowser.openBrowserAsync(item.urlLink)
      } else if (item.appLink) {
        try {
          const supported = await Linking.canOpenURL(item.appLink)

          if (supported) {
            Linking.openURL(item.appLink)
          } else {
            toast.warning({ title: "Please find us in app store" })
          }
        } catch (e) {
          toast.warning({ title: "Please find us in App store" })
        }
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
          isSoon={item.isSoon}
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

    const renderSectionHeader = React.useCallback(
      ({ section: { titleTx } }) => {
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
      },
      [bgSectionTitle],
    )

    return (
      <Screen
        preset="fixed"
        contentContainerStyle={{
          flex: 1,
        }}
      >
        <Box flex={1}>
          <SectionList
            sections={SETTINGS_LINKS}
            stickySectionHeadersEnabled={true}
            contentInsetAdjustmentBehavior="automatic"
            renderItem={renderItem}
            renderSectionHeader={renderSectionHeader}
            ListFooterComponent={renderFooter}
            SectionSeparatorComponent={() => <Divider mt={spacing.micro} bg="transparent" />}
          />
        </Box>
      </Screen>
    )
  },
)
