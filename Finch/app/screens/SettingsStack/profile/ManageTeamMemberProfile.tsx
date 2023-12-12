import { observer } from "mobx-react-lite"
import { Box, HStack, Stack, useColorModeValue } from "native-base"
import React from "react"

import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet"
import { Button, Text } from "../../../components"
import { LabelValuePill } from "../../../components/LabelValuePill"
import useReadUserProfile from "../../../services/api/userprofile/queries/useReadUserProfile"
import { colors, spacing } from "../../../theme"
import { runFormatPhoneSimple } from "../../../utils/useFormatPhone"

import { useNavigation } from "@react-navigation/native"
import { gestureHandlerRootHOC } from "react-native-gesture-handler"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { PressableActionRow } from "../../../components/PressableActionRow"
import { translate } from "../../../i18n"
import useUpdateTeamMember from "../../../services/api/teammembers/mutations/useUpdateTeamMember"
import useReadTeamMemberProfile from "../../../services/api/teammembers/queries/useReadTeamMemberProfile"
import { useColor } from "../../../theme/useColor"
import { useCustomToast } from "../../../utils/useCustomToast"
import { ChangeTeamMemberAvatarButton } from "./ChangeTeamMemberAvatarButton"
import { EditProfileNameForm, IEditProfileNameFormInput } from "./EditProfileNameForm"
import { EditProfilePhoneForm, IEditProfilePhoneFormInput } from "./EditProfilePhoneForm"

enum EditFormModeEnum {
  NAME = "NAME",
  PHONE = "PHONE",
  ADDRESS = "ADDRESS",
  COMPANY = "COMPANY",
}

export type FormHandle = {
  submitForm: () => void
}

const ManageTeamMemberProfileBase = observer(function ManageTeamMemberProfile(_props) {
  const navigation = useNavigation<any>()

  // ref
  const [editMode, setEditMode] = React.useState<EditFormModeEnum>()
  const bottomSheetModalRef = React.useRef<BottomSheetModal>(null)
  const formRef = React.useRef<FormHandle>(null)

  const snapPoints = React.useMemo(() => ["50%", "80%"], [])
  const { top: topInset, bottom: bottomInset } = useSafeAreaInsets()

  const toast = useCustomToast()

  const bgHighColor = useColor("bg.high")
  const bgColor = useColor("bg.main")
  const borderColor = useColorModeValue(colors.gray[200], colors.gray[700])

  const { data: userProfile, isLoading: isLoadingProfile } = useReadUserProfile()
  const { mutateAsync: mutateAsyncProfile, isLoading: isLoadingUpdate } = useUpdateTeamMember()

  const { data: dataTeamMemberProfile } = useReadTeamMemberProfile()

  const handleOnSubmitProfileUpdate = async (data: IEditProfileNameFormInput) => {
    if (!dataTeamMemberProfile?.TeamMemberId) {
      return
    }

    try {
      await mutateAsyncProfile({
        teamMemberId: dataTeamMemberProfile.TeamMemberId,
        updateData: data,
      })
      toast.success({ title: translate("common.saved") })
      handleOnCancel()
    } catch (e) {
      toast.error({ title: "Error saving" })
    }
  }

  const handleOnSubmitProfilePhoneUpdate = async (data: IEditProfilePhoneFormInput) => {
    if (!dataTeamMemberProfile.TeamMemberId) {
      return
    }

    try {
      await mutateAsyncProfile({
        teamMemberId: dataTeamMemberProfile.TeamMemberId,
        updateData: data,
      })
      toast.success({ title: translate("common.saved") })
      handleOnCancel()
    } catch (e) {
      toast.error({ title: "Error saving" })
    }
  }

  const handleOnCancel = () => {
    setEditMode(undefined)
    bottomSheetModalRef.current?.dismiss()
  }

  const handleOnSave = () => {
    formRef.current.submitForm()
  }

  const handleOnEditName = () => {
    setEditMode(EditFormModeEnum.NAME)
    bottomSheetModalRef.current?.present()
  }

  const handleOnEditPhone = () => {
    setEditMode(EditFormModeEnum.PHONE)
    bottomSheetModalRef.current?.present()
  }

  const handleOnDelete = () => {
    navigation.navigate("DeleteAccount", {})
  }

  const handleOnFileSelected = async (brandUrl: string) => {
    // const messageMediaItemsUpdate = messageMediaItems.map((mediaItem) => mediaItem)
    // messageMediaItemsUpdate.push(newMediaItem)
    // setMessageMediaItems(messageMediaItemsUpdate)
    try {
      await mutateAsyncProfile({
        teamMemberId: dataTeamMemberProfile.TeamMemberId,
        updateData: { BrandImageUrl: brandUrl },
      })
      toast.success({ title: translate("common.saved") })
      handleOnCancel()
    } catch (e) {
      toast.error({ title: "Error saving" })
    }
  }

  return (
    <>
      <Stack space={spacing.extraSmall}>
        <Stack space={spacing.extraSmall} px={spacing.tiny}>
          <ChangeTeamMemberAvatarButton
            teamMemberId={dataTeamMemberProfile?.TeamMemberId}
            onFileSelect={handleOnFileSelected}
          />
          <LabelValuePill.Text
            label="fieldLabels.name"
            icon="userCircle"
            text={`${dataTeamMemberProfile?.FirstName} ${dataTeamMemberProfile?.LastName}`}
            onEdit={handleOnEditName}
          />
          <LabelValuePill.Text
            label="fieldLabels.phone"
            icon="phone"
            text={runFormatPhoneSimple(dataTeamMemberProfile?.Phone)}
            onEdit={handleOnEditPhone}
          />

          <LabelValuePill.Text
            label="fieldLabels.email"
            icon="envelope"
            text={dataTeamMemberProfile?.Email}
          />
        </Stack>
        <PressableActionRow
          tx="settings.deleteAccount"
          icon={{
            icon: "trash",
          }}
          onPress={handleOnDelete}
        ></PressableActionRow>
      </Stack>

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
              tx="settings.editProfile"
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
          {editMode === EditFormModeEnum.NAME ? (
            <EditProfileNameForm
              ref={formRef}
              data={{
                FirstName: userProfile.FirstName,
                LastName: userProfile.LastName,
              }}
              onSubmit={handleOnSubmitProfileUpdate}
            />
          ) : null}

          {editMode === EditFormModeEnum.PHONE ? (
            <EditProfilePhoneForm
              ref={formRef}
              data={{
                Phone: userProfile.Phone,
              }}
              onSubmit={handleOnSubmitProfilePhoneUpdate}
            />
          ) : null}
        </BottomSheetScrollView>
      </BottomSheetModal>
    </>
  )
})

export const ManageTeamMemberProfile = gestureHandlerRootHOC(ManageTeamMemberProfileBase)
