import { observer } from "mobx-react-lite"
import { Box, HStack, Spinner, Stack } from "native-base"
import React, { FC } from "react"

import { AutoImage, Button, Screen, Text } from "../../../components"
import { LabelValuePill } from "../../../components/LabelValuePill"
import useReadUserProfile from "../../../services/api/userprofile/queries/useReadUserProfile"
import { spacing } from "../../../theme"

import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet"
import * as WebBrowser from "expo-web-browser"
import { gestureHandlerRootHOC } from "react-native-gesture-handler"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import appConfig from "../../../../app-config"
import { PressableActionRow } from "../../../components/PressableActionRow"
import { translate } from "../../../i18n"
import useReadConnector from "../../../services/api/connectors/queries/useReadConnector"
import useUpdateCrmSync from "../../../services/api/crmsync/mutations/useUpdateCrmSync"
import useReadCrmSync from "../../../services/api/crmsync/queries/useReadCrmSync"
import { useColor } from "../../../theme/useColor"
import { useCustomToast } from "../../../utils/useCustomToast"
import { SettingsStackScreenProps } from "../../SettingsStack/SettingsStack"
import { EditCRMSyncEnabledForm, IEditCRMSyncEnabledFormInput } from "./EditCRMSyncEnabledForm"

const SUPPORTED_CRM_URLS = [
  "https://cc-west-prd-bucket-users.s3.us-west-2.amazonaws.com/public/general/media/agencybloc_logo.png",
  "https://cc-west-prd-bucket-users.s3.us-west-2.amazonaws.com/public/general/media/agentcore_logo.png",
  "https://cc-west-prd-bucket-users.s3.us-west-2.amazonaws.com/public/general/media/hubspot_logo.png",
  "https://cc-west-prd-bucket-users.s3.us-west-2.amazonaws.com/public/general/media/radiusbob_logo.png",
  "https://cc-west-prd-bucket-users.s3.us-west-2.amazonaws.com/public/general/media/redtail_logo.png",
  "https://cc-west-prd-bucket-users.s3.us-west-2.amazonaws.com/public/general/media/wealthbox_logo.png",
]

enum EditFormModeEnum {
  ISENABLED = "ISENABLED",
}

export type FormHandle = {
  submitForm: () => void
}

export const CrmSyncScreenBase: FC<SettingsStackScreenProps<"MySubscription">> = observer(
  function CrmSyncScreen(_props) {
    const [editMode, setEditMode] = React.useState<EditFormModeEnum>()
    const bottomSheetModalRef = React.useRef<BottomSheetModal>(null)
    const formRef = React.useRef<FormHandle>(null)

    const snapPoints = React.useMemo(() => ["50%", "80%"], [])
    const { top: topInset, bottom: bottomInset } = useSafeAreaInsets()

    const toast = useCustomToast()

    const borderColor = useColor("text.softest")
    const bgHighColor = useColor("bg.high")
    const bgCard = useColor("bg.high")
    const bgColor = useColor("bg.main")

    const { data: userProfile, isLoading: isLoadingProfile } = useReadUserProfile()
    const { data: dataCrmSync, isLoading: isLoadingCrmSync } = useReadCrmSync(userProfile?.UserId)
    const { mutateAsync: mutateAsyncUpdate, isLoading: isLoadingUpdate } = useUpdateCrmSync()
    const { data: dataConnector } = useReadConnector(dataCrmSync?.ConnectorId)

    const handleOnEdit = () => {
      setEditMode(EditFormModeEnum.ISENABLED)
      bottomSheetModalRef.current?.present()
    }

    const createNewSync = async () => {
      const res = `${appConfig.Web.hostname}/app/settings/connectors`

      if (res) {
        WebBrowser.openBrowserAsync(res)
      }
    }

    const handleOnSubmitEnabled = async (data: IEditCRMSyncEnabledFormInput) => {
      if (userProfile?.UserId) {
        try {
          await mutateAsyncUpdate({
            userId: userProfile.UserId,
            updateData: { IsEnabled: data.IsEnabled },
          })
          toast.success({ title: translate("common.saved") })
          handleOnCancel()
        } catch (e) {
          toast.error({ title: "Error saving" })
        }
      }
    }

    const handleOnCancel = () => {
      setEditMode(undefined)
      bottomSheetModalRef.current?.dismiss()
    }

    const handleOnSave = () => {
      formRef.current.submitForm()
    }

    return (
      <>
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
                  <Text fontSize="lg" preset="subheading" tx="crmSync.pageHeader"></Text>
                  <Text colorToken="text.softer" tx="crmSync.pageSubheader"></Text>
                </Stack>

                <Stack space={spacing.extraSmall} px={spacing.tiny}>
                  <LabelValuePill.Boolean
                    label="crmSync.statusSync"
                    icon="arrowLeftRight"
                    onEdit={handleOnEdit}
                    value={dataCrmSync && dataCrmSync?.IsEnabled}
                  />

                  {dataConnector && dataConnector.ConnectorType ? (
                    <LabelValuePill.SourceCrm
                      label="crmSync.activeSyncSource"
                      icon="arrowLeftRight"
                      sourceCrm={dataConnector.ConnectorType}
                    />
                  ) : null}

                  {dataCrmSync && dataCrmSync.IsEnabled ? (
                    <>
                      <LabelValuePill.Boolean
                        label="crmSync.isAllowCreate"
                        icon="settings"
                        value={dataCrmSync && dataCrmSync?.IsAllowCreate}
                      />
                      <LabelValuePill.Boolean
                        label="crmSync.isAllowUpdate"
                        icon="settings"
                        value={dataCrmSync && dataCrmSync?.IsAllowUpdate}
                      />
                      <LabelValuePill.Boolean
                        label="crmSync.isAllowNotes"
                        icon="settings"
                        value={dataCrmSync && dataCrmSync?.IsAllowNotes}
                      />
                    </>
                  ) : null}
                </Stack>

                <Stack space={spacing.extraSmall} px={spacing.tiny}>
                  <Text colorToken="text.softer" fontSize="md" tx="crmSync.supportedCRMS"></Text>

                  <Stack space={spacing.tiny}>
                    {SUPPORTED_CRM_URLS.map((url) => (
                      <HStack
                        key={url}
                        bg={bgCard}
                        borderWidth={1}
                        borderColor={borderColor}
                        rounded="lg"
                        py={spacing.tiny}
                        overflow={"hidden"}
                        justifyContent="center"
                      >
                        <AutoImage
                          resizeMode="cover"
                          source={{
                            uri: url,
                          }}
                          maxHeight={48}
                        />
                      </HStack>
                    ))}
                  </Stack>
                </Stack>

                <PressableActionRow
                  tx="crmSync.createNew"
                  icon={{
                    icon: "puzzle",
                  }}
                  onPress={createNewSync}
                ></PressableActionRow>
              </Stack>
            )}
          </Box>
        </Screen>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={0}
          snapPoints={snapPoints}
          topInset={topInset}
          style={{
            borderTopWidth: 1,
            borderTopColor: borderColor,
          }}
          handleStyle={{
            backgroundColor: bgHighColor,
          }}
          handleIndicatorStyle={{
            backgroundColor: borderColor,
          }}
          android_keyboardInputMode="adjustResize"
        >
          <Box
            pb={spacing.tiny}
            px={spacing.tiny}
            borderBottomWidth={1}
            borderBottomColor={borderColor}
            bg={bgHighColor}
          >
            <HStack justifyContent={"space-between"}>
              <Box flex={1}>
                <Button onPress={handleOnCancel} size="xs" tx="common.cancel"></Button>
              </Box>

              <Text
                flex={3}
                preset="heading"
                textAlign={"center"}
                fontSize="xl"
                tx="crmSync.edit"
              ></Text>

              <Box flex={1}>
                <Button
                  isLoading={isLoadingUpdate}
                  onPress={handleOnSave}
                  size="xs"
                  colorScheme={"primary"}
                  tx="common.save"
                ></Button>
              </Box>
            </HStack>
          </Box>
          <BottomSheetScrollView
            style={{
              flex: 1,
              backgroundColor: bgColor,
            }}
          >
            {editMode === EditFormModeEnum.ISENABLED ? (
              <EditCRMSyncEnabledForm
                ref={formRef}
                data={{
                  IsEnabled: dataCrmSync.IsEnabled,
                }}
                onSubmit={handleOnSubmitEnabled}
              />
            ) : null}
          </BottomSheetScrollView>
        </BottomSheetModal>
      </>
    )
  },
)

export const CrmSyncScreen = gestureHandlerRootHOC(CrmSyncScreenBase)
