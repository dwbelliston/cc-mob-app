import { observer } from "mobx-react-lite"
import { Box, Stack } from "native-base"
import React, { FC } from "react"

import { Screen, Text } from "../../../components"
import { spacing } from "../../../theme"

import { SettingsStackScreenProps } from "../SettingsStack"

import { gestureHandlerRootHOC } from "react-native-gesture-handler"
import { Butter } from "../../../components/Butter"

export type FormHandle = {
  submitForm: () => void
}

const VoicemailScreenBase: FC<SettingsStackScreenProps<"Voicemail">> = observer(
  function VoicemailScreen(_props) {
    return (
      <Screen preset="scroll" style={{}}>
        <Box py={spacing.extraSmall}>
          <Stack space={spacing.extraSmall} px={spacing.tiny}>
            <Stack>
              <Text fontSize="lg" preset="subheading" tx="voicemail.pageHeader"></Text>
              <Text colorToken="text.softer" tx="voicemail.pageSubheader"></Text>
            </Stack>
            <Box>
              <Butter.Warning
                titleText={{ tx: "common.desktopOnly" }}
                descriptionText={{
                  tx: "common.desktopOnlyMore",
                  fontSize: "xs",
                }}
              ></Butter.Warning>
            </Box>
            <Text fontSize="lg" tx="voicemail.notice"></Text>
          </Stack>
        </Box>
      </Screen>
    )
  },
)

export const VoicemailScreen = gestureHandlerRootHOC(VoicemailScreenBase)
