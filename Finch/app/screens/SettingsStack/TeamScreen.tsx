import { observer } from "mobx-react-lite"
import { Box, Stack } from "native-base"
import React, { FC } from "react"

import { Screen, Text } from "../../components"
import { spacing } from "../../theme"

import { useSafeAreaInsets } from "react-native-safe-area-context"
import { SettingsStackScreenProps } from "./SettingsStack"
import TeamMembersList from "./team/components/TeamMembersList"

export const TeamScreen: FC<SettingsStackScreenProps<"Team">> = observer(
  function MySubscriptionScreen(_props) {
    const { bottom: bottomInset } = useSafeAreaInsets()

    return (
      <Screen
        preset="scroll"
        contentContainerStyle={{
          paddingBottom: bottomInset + spacing.large,
        }}
        style={{}}
      >
        <Box py={spacing.extraSmall}>
          <Stack space={spacing.extraSmall}>
            <Stack px={spacing.tiny}>
              <Text fontSize="lg" preset="subheading" tx="team.pageHeader"></Text>
              <Text colorToken="text.softer" tx="team.pageSubheader"></Text>
            </Stack>

            <Box px={spacing.tiny}>
              <TeamMembersList />
            </Box>
          </Stack>
        </Box>
      </Screen>
    )
  },
)
