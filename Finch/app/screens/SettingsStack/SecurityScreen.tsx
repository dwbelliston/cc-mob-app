import { Auth } from "@aws-amplify/auth"
import { observer } from "mobx-react-lite"
import { Box, Spinner, Stack } from "native-base"
import React, { FC } from "react"

import { Screen, Text } from "../../components"
import { LabelValuePill } from "../../components/LabelValuePill"
import useReadUserProfile from "../../services/api/userprofile/queries/useReadUserProfile"
import { spacing } from "../../theme"

import { useSafeAreaInsets } from "react-native-safe-area-context"
import { SettingsStackScreenProps } from "./SettingsStack"

export const SecurityScreen: FC<SettingsStackScreenProps<"Security">> = observer(
  function MySubscriptionScreen(_props) {
    const [isMfaEnabled, setIsMfaEnabled] = React.useState(false)
    const { bottom: bottomInset } = useSafeAreaInsets()

    const { data: userProfile, isLoading: isLoadingProfile } = useReadUserProfile()

    const handleSetUser = async () => {
      const aUser = await Auth.currentAuthenticatedUser()
      setIsMfaEnabled(aUser?.preferredMFA !== "NOMFA")
    }

    React.useEffect(() => {
      handleSetUser(), []
    })

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
            <Stack space={spacing.extraSmall}>
              <Stack px={spacing.tiny}>
                <Text fontSize="lg" preset="subheading" tx="security.pageHeader"></Text>
                <Text colorToken="text.softer" tx="security.pageSubheader"></Text>
              </Stack>
              <Stack space={spacing.extraSmall} px={spacing.tiny}>
                <LabelValuePill.Text
                  label="security.email"
                  icon="atSymbol"
                  text={userProfile.Email}
                />

                <LabelValuePill.Boolean
                  label="security.multiFactorAuth"
                  icon="lockClosed"
                  value={isMfaEnabled}
                  trueText={"Enabled"}
                  falseText={"Disabled"}
                />
              </Stack>
            </Stack>
          )}
        </Box>
      </Screen>
    )
  },
)
