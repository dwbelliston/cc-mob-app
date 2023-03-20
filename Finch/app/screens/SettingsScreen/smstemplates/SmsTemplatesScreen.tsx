import { observer } from "mobx-react-lite"
import { Box, Fab, FlatList, HStack, Spinner, Stack, View } from "native-base"
import React, { FC } from "react"

import { Button, Icon, Screen, Text } from "../../../components"
import useReadUserProfile from "../../../services/api/userprofile/queries/useReadUserProfile"
import { spacing } from "../../../theme"

import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { DataStatus } from "../../../components/DataStatus"
import { PressableActionRow } from "../../../components/PressableActionRow"
import { translate } from "../../../i18n"
import { ISmsTemplate, ISmsTemplateCreate, ISmsTemplateUpdate } from "../../../models/SmsTemplate"
import useCreateSmsTemplate from "../../../services/api/smstemplates/mutations/useCreateSmsTemplate"
import useDeleteSmsTemplate from "../../../services/api/smstemplates/mutations/useDeleteSmsTemplate"
import useUpdateSmsTemplate from "../../../services/api/smstemplates/mutations/useUpdateSmsTemplate"
import useListSmsTemplates from "../../../services/api/smstemplates/queries/useListSmsTemplates"
import { useColor } from "../../../theme/useColor"
import { useCustomToast } from "../../../utils/useCustomToast"
import { SettingsStackScreenProps } from "../SettingsStack"
import { CreateSmsTemplateForm } from "./CreateSmsTemplateForm"
import { EditSmsTemplateForm } from "./EditSmsTemplateForm"

export type FormHandle = {
  submitForm: () => void
}

enum EditFormModeEnum {
  EDIT = "EDIT",
  CREATE = "CREATE",
}

export const SmsTemplatesScreen: FC<SettingsStackScreenProps<"MySubscription">> = observer(
  function SmsTemplatesScreen(_props) {
    const [editTemplate, setEditTemplate] = React.useState<ISmsTemplate>()
    const [editMode, setEditMode] = React.useState<EditFormModeEnum>()
    const bottomSheetModalRef = React.useRef<BottomSheetModal>(null)
    const formRef = React.useRef<FormHandle>(null)
    const [flatData, setFlatData] = React.useState<ISmsTemplate[]>()

    const snapPoints = React.useMemo(() => ["80%", "95%"], [])
    const { top: topInset, bottom: bottomInset } = useSafeAreaInsets()

    const toast = useCustomToast()

    const borderColor = useColor("text.softest")
    const bgHighColor = useColor("bg.high")

    const bgColor = useColor("bg.main")

    const { data: userProfile, isLoading: isLoadingProfile } = useReadUserProfile()
    const { data: dataTemplates, isLoading: isLoadingTemplates } = useListSmsTemplates()
    const { mutateAsync: mutateAsyncUpdate, isLoading: isLoadingUpdate } = useUpdateSmsTemplate()
    const { mutateAsync: mutateAsyncCreate, isLoading: isLoadingCreate } = useCreateSmsTemplate()
    const { mutateAsync: mutateAsyncDelete, isLoading: isLoadingDelete } = useDeleteSmsTemplate()

    const handleEditTemplate = (smsTemplate: ISmsTemplate) => {
      setEditMode(EditFormModeEnum.EDIT)
      setEditTemplate(smsTemplate)
      bottomSheetModalRef.current?.present()
    }

    const handleOnCreateNew = () => {
      setEditMode(EditFormModeEnum.CREATE)
      bottomSheetModalRef.current?.present()
    }

    // const createNewSync = async () => {
    //   const res = `${appConfig.Web.hostname}/app/settings/connectors`

    //   if (res) {
    //     WebBrowser.openBrowserAsync(res)
    //   }
    // }

    const handleOnCreate = async (data: ISmsTemplateCreate) => {
      try {
        await mutateAsyncCreate(data)
        toast.success({ title: translate("common.created!") })
        handleOnCancel()
      } catch (e) {
        toast.error({ title: "Error saving" })
      }
    }
    const handleOnSubmitUpdate = async (data: ISmsTemplateUpdate) => {
      if (editTemplate.SmsTemplateId) {
        try {
          await mutateAsyncUpdate({
            smsTemplateId: editTemplate.SmsTemplateId,
            updateData: data,
          })
          toast.success({ title: translate("common.saved") })
          handleOnCancel()
        } catch (e) {
          toast.error({ title: "Error saving" })
        }
      }
    }

    const handleOnDelete = async () => {
      if (editTemplate.SmsTemplateId) {
        try {
          await mutateAsyncDelete(editTemplate.SmsTemplateId)
          toast.success({ title: translate("common.deleted") })
          handleOnCancel()
        } catch (e) {
          toast.error({ title: "Error saving" })
        }
      }
    }

    const handleOnCancel = () => {
      setEditMode(undefined)
      setEditTemplate(undefined)
      bottomSheetModalRef.current?.dismiss()
    }

    const handleOnSave = () => {
      formRef.current.submitForm()
    }

    const renderItem = React.useCallback(
      ({ item }: { item: ISmsTemplate }) => (
        <PressableActionRow
          text={item.Title}
          icon={{
            icon: "clipboardDocumentCheck",
          }}
          onPress={() => handleEditTemplate(item)}
        ></PressableActionRow>
      ),
      [bgColor, borderColor],
    )

    React.useEffect(() => {
      if (dataTemplates) {
        const flatDataUpdate: ISmsTemplate[] = dataTemplates.records.flatMap(
          (template, idx) => template,
        )

        setFlatData(flatDataUpdate)
      }
    }, [dataTemplates])

    return (
      <Screen preset="fixed">
        <View h="full">
          {isLoadingProfile ? (
            <Spinner></Spinner>
          ) : (
            <FlatList
              contentContainerStyle={{
                paddingBottom: bottomInset,
              }}
              data={flatData}
              ListEmptyComponent={
                isLoadingTemplates ? (
                  <Box px={spacing.tiny} py={spacing.small} h="full">
                    <Text
                      textAlign={"center"}
                      colorToken="text.softer"
                      tx="common.oneMoment"
                    ></Text>
                  </Box>
                ) : (
                  <Box px={spacing.tiny} py={spacing.small} h="full">
                    <DataStatus
                      title={translate("smsTemplates.noTemplates")}
                      description={translate("smsTemplates.noTemplatesDescription")}
                      icon={"clipboardDocumentCheck"}
                      colorScheme={"gray"}
                    />
                  </Box>
                )
              }
              keyExtractor={(i) => i.SmsTemplateId}
              renderItem={renderItem}
              // ItemSeparatorComponent={() => <Divider py={spacing.micro} bg="transparent" />}
            />
          )}
        </View>
        <Fab
          renderInPortal={false}
          shadow={0}
          mb={bottomInset}
          p={3}
          onPress={handleOnCreateNew}
          rounded="full"
          icon={<Icon color="white" size={28} icon="plus" />}
        />
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
                tx={editMode === EditFormModeEnum.CREATE ? "common.create" : "common.edit"}
              ></Text>

              <Box flex={1}>
                <Button
                  isLoading={isLoadingUpdate || isLoadingCreate}
                  onPress={handleOnSave}
                  size="xs"
                  colorScheme={"primary"}
                  tx={"common.save"}
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
            <Stack space={spacing.tiny} px={spacing.tiny} py={spacing.extraSmall}>
              {editMode === EditFormModeEnum.EDIT && editTemplate ? (
                <>
                  <EditSmsTemplateForm
                    ref={formRef}
                    data={editTemplate}
                    onSubmit={handleOnSubmitUpdate}
                  />
                  <Text colorToken={"text.soft"} tx="smsTemplates.editInfo"></Text>
                  <Text colorToken={"text.soft"} tx="smsTemplates.editHint"></Text>
                  <Box>
                    <Button
                      isLoading={isLoadingDelete}
                      size="sm"
                      colorScheme={"error"}
                      onPress={handleOnDelete}
                      tx="common.delete"
                    ></Button>
                  </Box>
                </>
              ) : null}
              {editMode === EditFormModeEnum.CREATE ? (
                <>
                  <CreateSmsTemplateForm
                    ref={formRef}
                    data={editTemplate}
                    onSubmit={handleOnCreate}
                  />
                  <Text colorToken={"text.soft"} tx="smsTemplates.editInfo"></Text>
                  <Text colorToken={"text.soft"} tx="smsTemplates.editHint"></Text>
                </>
              ) : null}
            </Stack>
          </BottomSheetScrollView>
        </BottomSheetModal>
      </Screen>
    )
  },
)
