import { Auth } from "@aws-amplify/auth"
import { observer } from "mobx-react-lite"
import { Box, HStack, Spinner, Stack } from "native-base"
import React, { FC } from "react"

import { Icon, Screen, Text } from "../../components"
import { LabelValuePill } from "../../components/LabelValuePill"
import useReadUserProfile from "../../services/api/userprofile/queries/useReadUserProfile"
import { spacing } from "../../theme"

import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useStores } from "../../models"
import { useColor } from "../../theme/useColor"
import { useCustomToast } from "../../utils/useCustomToast"
import { SettingsStackScreenProps } from "./SettingsStack"

export const SecurityScreen: FC<SettingsStackScreenProps<"Security">> = observer(
  function MySubscriptionScreen(_props) {
    const [isMfaEnabled, setIsMfaEnabled] = React.useState(false)
    const [myDevices, setMyDevices] = React.useState([])
    const { bottom: bottomInset } = useSafeAreaInsets()

    const borderColor = useColor("text.softest")
    const toast = useCustomToast()

    const {
      authenticationStore: { forgetDevice },
    } = useStores()

    const { data: userProfile, isLoading: isLoadingProfile } = useReadUserProfile()

    const handleSetUser = React.useCallback(async () => {
      const aUser = await Auth.currentAuthenticatedUser()
      setIsMfaEnabled(aUser?.preferredMFA !== "NOMFA")
    }, [])

    const handleUpdateDevices = async () => {
      const devices = await Auth.fetchDevices()

      if (devices) {
        const updateDevices = []
        devices.forEach((device) => {
          const mDevId = device["id"].slice(-5)

          const mFullId = `********${mDevId}`

          const mDevice = {
            id: mFullId,
          }
          updateDevices.push(mDevice)
        })
        setMyDevices(updateDevices)
      }
    }

    // const handleForgetDevice = async () => {
    //   try {
    //     await forgetDevice()
    //     toast.success({ title: translate("security.removedDevice") })
    //   } catch (e) {
    //     console.log(e)
    //   }

    //   handleUpdateDevices()
    // }

    React.useEffect(() => {
      handleSetUser(), []
    })

    React.useEffect(() => {
      const getDevice = async () => {
        const devices = await Auth.fetchDevices()

        if (devices) {
          const updateDevices = []
          devices.forEach((device) => {
            const mDevId = device["id"].slice(-5)

            const mFullId = `********${mDevId}`

            const mDevice = {
              id: mFullId,
            }
            updateDevices.push(mDevice)
          })
          setMyDevices(updateDevices)
        }
      }
      getDevice()
    }, [])

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

              <Stack space={spacing.extraSmall} px={spacing.tiny} pt={spacing.small}>
                <Text fontSize="lg" preset="subheading" tx="security.rememberedDevices"></Text>

                {myDevices && myDevices.length ? (
                  <Stack space={spacing.tiny}>
                    {myDevices.map((myDevice) => (
                      <HStack
                        borderWidth={1}
                        rounded="lg"
                        borderColor={borderColor}
                        px={spacing.micro}
                        key={myDevice.id}
                        py={spacing.tiny}
                        overflow={"hidden"}
                        space={spacing.tiny}
                      >
                        <Icon icon="devicePhoneMobile" />
                        <Text>{myDevice.id}</Text>
                      </HStack>
                    ))}
                    {/* <Button
                      colorScheme={"red"}
                      // variant={"outline"}
                      size="sm"
                      onPress={handleForgetDevice}
                      rightIcon={<Icon icon="trash" size={12} />}
                      tx="security.forgetThisDevice"
                    ></Button> */}
                  </Stack>
                ) : (
                  <Text colorToken="text.softer" tx="security.noRememberedDevices"></Text>
                )}
              </Stack>
            </Stack>
          )}
        </Box>
      </Screen>
    )
  },
)
