import { observer } from "mobx-react-lite"
import { Box, Spinner, Stack, useColorModeValue } from "native-base"
import React, { FC } from "react"
import * as yup from "yup"

import { Button, Screen, Text } from "../../components"
import useReadUserProfile from "../../services/api/userprofile/queries/useReadUserProfile"
import { spacing } from "../../theme"

import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import { Butter } from "../../components/Butter"
import { FormControl } from "../../components/FormControl"
import { translate } from "../../i18n"
import useUpdateUserProfile from "../../services/api/userprofile/mutations/useUpdateUserProfile"
import { useCustomToast } from "../../utils/useCustomToast"
import { SettingsStackScreenProps } from "./SettingsStack"

export const DeleteAccountScreen: FC<SettingsStackScreenProps<"DeleteAccount">> = observer(
  function DeleteAccountScreen(_props) {
    const toast = useCustomToast()

    const statusBarColor = useColorModeValue("dark", "light")

    const form = useForm<{ delete: string }>({
      resolver: yupResolver(
        yup.object({
          delete: yup.string().oneOf(["delete", "Delete", "DELETE"]).required("Please confirm"),
        }),
      ),
    })

    const { data: userProfile, isLoading: isLoadingProfile } = useReadUserProfile()
    const { mutateAsync: mutateAsyncProfile, isLoading: isLoadingUpdate } = useUpdateUserProfile()

    const handleOnDelete = async () => {
      if (form.formState.isValid) {
        try {
          await mutateAsyncProfile({ IsDeleteRequested: true })
          toast.success({ title: translate("settings.requestComplete") })
        } catch (e) {
          toast.error({ title: "Error saving" })
        }
      }
    }

    return (
      <Screen
        preset="scroll"
        safeAreaEdges={["bottom"]}
        contentContainerStyle={{
          paddingBottom: spacing.large,
        }}
        style={{}}
        statusBarStyle={statusBarColor}
      >
        <Box py={spacing.tiny} px={spacing.tiny}>
          {isLoadingProfile ? (
            <Spinner></Spinner>
          ) : (
            <Stack space={spacing.tiny}>
              <Text fontSize="lg" preset="subheading" tx="settings.deleteAccount"></Text>
              <Text colorToken="text.softer" fontSize="md" tx="settings.deleteAccountSub"></Text>
              <Text tx="settings.deleteAccountExplain"></Text>

              {userProfile.IsDeleteRequested ? (
                <Box>
                  <Butter.Info
                    titleText={{ tx: "settings.requestComplete" }}
                    descriptionText={{ tx: "settings.deleteRequestedHelp", fontSize: "xs" }}
                  ></Butter.Info>
                </Box>
              ) : (
                <Box>
                  {userProfile?.IsTeamMember ? (
                    <Stack>
                      <Text colorToken="warning">
                        Since you are a member of a team, your account admin needs to intiate the
                        request to delete your account
                      </Text>
                      <Text>{userProfile.AdminEmail}</Text>
                    </Stack>
                  ) : (
                    <>
                      <FormControl
                        name="delete"
                        control={form.control}
                        multiline={false}
                        labelProps={{
                          tx: "settings.deleteAccountExplainConfirm",
                          colorToken: "warning",
                        }}
                      ></FormControl>
                      <Box pt={spacing.small}>
                        <Button
                          onPress={handleOnDelete}
                          isLoading={isLoadingUpdate}
                          colorScheme={"error"}
                          isDisabled={!form.formState.isValid}
                          tx="settings.deleteAccount"
                        ></Button>
                      </Box>
                    </>
                  )}
                </Box>
              )}
            </Stack>
          )}
        </Box>
      </Screen>
    )
  },
)
