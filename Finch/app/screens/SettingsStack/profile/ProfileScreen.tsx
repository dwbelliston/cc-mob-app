import { observer } from "mobx-react-lite"
import { Box, Spinner, useColorModeValue } from "native-base"
import React, { FC } from "react"

import { Screen } from "../../../components"
import useReadUserProfile from "../../../services/api/userprofile/queries/useReadUserProfile"
import { spacing } from "../../../theme"

import { gestureHandlerRootHOC } from "react-native-gesture-handler"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useIsAdminMember } from "../../../models/UserProfile"
import { SettingsStackScreenProps } from "../SettingsStack"
import { ManageProfile } from "./ManageProfile"
import { ManageTeamMemberProfile } from "./ManageTeamMemberProfile"

export type FormHandle = {
  submitForm: () => void
}

const ProfileScreenBase: FC<SettingsStackScreenProps<"Profile">> = observer(function ProfileScreen(
  _props,
) {
  const { bottom: bottomInset } = useSafeAreaInsets()

  const statusBarColor = useColorModeValue("dark", "light")

  const { data: userProfile, isLoading: isLoadingProfile } = useReadUserProfile()

  const isAdminUser = useIsAdminMember(userProfile)

  return (
    <>
      <Screen
        preset="scroll"
        contentContainerStyle={{
          paddingBottom: bottomInset + spacing.large,
        }}
        style={{}}
        statusBarStyle={statusBarColor}
      >
        <Box py={spacing.tiny}>
          {isLoadingProfile ? (
            <Spinner></Spinner>
          ) : (
            <Box>{isAdminUser ? <ManageProfile /> : <ManageTeamMemberProfile />}</Box>
          )}
        </Box>
      </Screen>
    </>
  )
})

export const ProfileScreen = gestureHandlerRootHOC(ProfileScreenBase)
