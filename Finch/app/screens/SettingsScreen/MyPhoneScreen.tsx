import { observer } from "mobx-react-lite"
import { Box, Spinner, Stack } from "native-base"
import React, { FC } from "react"

import { Screen, Text } from "../../components"
import { LabelValuePill } from "../../components/LabelValuePill"
import useReadUserProfile from "../../services/api/userprofile/queries/useReadUserProfile"
import { spacing } from "../../theme"

import { useSafeAreaInsets } from "react-native-safe-area-context"
import { runFormatDateWithAt } from "../../utils/useFormatDate"
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
                label="fieldLabels.assignedOn"
                icon="clock"
                text={runFormatDateWithAt(userProfile?.RegisteredNumber.DateCreated)}
              />

              <LabelValuePill.Boolean
                label="fieldLabels.registrationStatus"
                icon="fingerPrint"
                value={userProfile.IsPhoneRegistered}
                trueTx={"common.complete"}
                falseTx={"common.inProgress"}
              />
              <LabelValuePill.Boolean
                label="fieldLabels.supportsMMS"
                icon="photo"
                value={userProfile?.RegisteredNumber?.Capabilities?.IsMMSEnabled}
                trueTx={"common.supported"}
                falseTx={"common.notSupported"}
              />
              <LabelValuePill.Boolean
                label="fieldLabels.supportsVoice"
                icon="phone"
                value={userProfile?.RegisteredNumber?.Capabilities?.IsVoiceEnabled}
                trueTx={"common.supported"}
                falseTx={"common.notSupported"}
              />
            </Stack>
          )}
        </Box>
      </Screen>
    )
  },
)
