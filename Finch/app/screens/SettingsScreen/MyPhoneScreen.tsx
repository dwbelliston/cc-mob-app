import { observer } from "mobx-react-lite"
import { Box, Spinner, Stack } from "native-base"
import React, { FC } from "react"

import { Screen, Text } from "../../components"
import { LabelValuePill } from "../../components/LabelValuePill"
import useReadUserProfile from "../../services/api/userprofile/queries/useReadUserProfile"
import { spacing } from "../../theme"

import { useSafeAreaInsets } from "react-native-safe-area-context"
import { translate } from "../../i18n"
import { runFormatDate } from "../../utils/useFormatDate"
import { runFormatPhoneSimple } from "../../utils/useFormatPhone"
import { SettingsStackScreenProps } from "./SettingsStack"

export const MyPhoneScreen: FC<SettingsStackScreenProps<"MyPhone">> = observer(
  function MyPhoneScreen(_props) {
    const { bottom: bottomInset } = useSafeAreaInsets()

    const { data: userProfile, isLoading: isLoadingProfile } = useReadUserProfile()

    return (
      <Screen
        preset="scroll"
        contentContainerStyle={{
          paddingBottom: bottomInset + spacing.large,
        }}
        style={{}}
      >
        <Box py={spacing.extraSmall}>
          {isLoadingProfile ? (
            <Spinner></Spinner>
          ) : (
            <Stack space={spacing.extraSmall} px={spacing.tiny}>
              <Stack>
                <Text fontSize="lg" preset="subheading" tx="settings.numberDetails"></Text>
                <Text colorToken="text.softer" fontSize="md" tx="settings.numberDetailsInfo"></Text>
              </Stack>
              <LabelValuePill.Text
                label="fieldLabels.phone"
                icon="phone"
                text={runFormatPhoneSimple(userProfile?.RegisteredNumber.PhoneNumber)}
              />
              <LabelValuePill.Text
                label="fieldLabels.createdAt"
                icon="clock"
                text={runFormatDate(userProfile?.RegisteredNumber.DateCreated)}
              />
              <LabelValuePill.Text
                label="fieldLabels.registrationStatus"
                icon="fingerPrint"
                text={
                  userProfile.IsPhoneRegistered
                    ? translate("common.complete")
                    : translate("common.inProgress")
                }
              />
              <LabelValuePill.Text
                label="fieldLabels.supportsMMS"
                icon="photo"
                text={
                  userProfile?.RegisteredNumber?.Capabilities?.IsMMSEnabled
                    ? translate("common.supported")
                    : translate("common.notSupported")
                }
              />
              <LabelValuePill.Text
                label="fieldLabels.supportsVoice"
                icon="phoneArrowUpRight"
                text={
                  userProfile?.RegisteredNumber?.Capabilities?.IsVoiceEnabled
                    ? translate("common.supported")
                    : translate("common.notSupported")
                }
              />
            </Stack>
          )}
        </Box>
      </Screen>
    )
  },
)
