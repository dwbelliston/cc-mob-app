import { observer } from "mobx-react-lite"
import { Box, HStack, Spinner, Stack, useColorModeValue } from "native-base"
import React, { FC } from "react"

import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet"
import { Button, Screen, Text } from "../../../components"
import { LabelValuePill } from "../../../components/LabelValuePill"
import useReadUserProfile from "../../../services/api/userprofile/queries/useReadUserProfile"
import { colors, spacing } from "../../../theme"
import { runFormatPhoneSimple } from "../../../utils/useFormatPhone"

import { useSafeAreaInsets } from "react-native-safe-area-context"
import { PressableActionRow } from "../../../components/PressableActionRow"
import { translate } from "../../../i18n"
import useUploadUserMedia from "../../../services/api/usermedia/mutations/useUploadUserMedia"
import useUpdateUserProfile from "../../../services/api/userprofile/mutations/useUpdateUserProfile"
import { useColor } from "../../../theme/useColor"
import { useCustomToast } from "../../../utils/useCustomToast"
import { SettingsStackScreenProps } from "../SettingsStack"
import { ChangeAvatarButton } from "./ChangeAvatarButton"
import { EditProfileAddressForm, IEditProfileAddressFormInput } from "./EditProfileAddressForm"
import {
  EditProfileCompanyNameForm,
  IEditProfileCompanyNameFormInput,
} from "./EditProfileCompanyForm"
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

export const ProfileScreen: FC<SettingsStackScreenProps<"Profile">> = observer(
  function ProfileScreen(_props) {
    const { navigation } = _props
    // ref
    const [editMode, setEditMode] = React.useState<EditFormModeEnum>()
    const bottomSheetModalRef = React.useRef<BottomSheetModal>(null)
    const formRef = React.useRef<FormHandle>(null)

    const snapPoints = React.useMemo(() => ["50%", "80%"], [])
    const { top: topInset, bottom: bottomInset } = useSafeAreaInsets()

    const toast = useCustomToast()

    const statusBarColor = useColorModeValue("dark", "light")
    const bgHighColor = useColor("bg.high")
    const bgColor = useColor("bg.main")
    const borderColor = useColorModeValue(colors.gray[200], colors.gray[700])

    const { data: userProfile, isLoading: isLoadingProfile } = useReadUserProfile()
    const { mutateAsync: mutateAsyncProfile, isLoading: isLoadingUpdate } = useUpdateUserProfile()
    const { mutateAsync: mutateAsyncUpload, isLoading: isLoadingUpload } = useUploadUserMedia()

    const handleOnSubmitProfileUpdate = async (data: IEditProfileNameFormInput) => {
      try {
        await mutateAsyncProfile({ ...data })
        toast.success({ title: translate("common.saved") })
        handleOnCancel()
      } catch (e) {
        toast.error({ title: "Error saving" })
      }
    }

    const handleOnSubmitProfilePhoneUpdate = async (data: IEditProfilePhoneFormInput) => {
      try {
        await mutateAsyncProfile({ ...data })
        toast.success({ title: translate("common.saved") })
        handleOnCancel()
      } catch (e) {
        toast.error({ title: "Error saving" })
      }
    }

    const handleOnSubmitProfileAddressUpdate = async (data: IEditProfileAddressFormInput) => {
      try {
        await mutateAsyncProfile({ ...data })
        toast.success({ title: translate("common.saved") })
        handleOnCancel()
      } catch (e) {
        toast.error({ title: "Error saving" })
      }
    }

    const handleOnSubmitCompanyUpdate = async (data: IEditProfileCompanyNameFormInput) => {
      try {
        await mutateAsyncProfile({ ...data })
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

    const handleOnEditAddress = () => {
      setEditMode(EditFormModeEnum.ADDRESS)
      bottomSheetModalRef.current?.present()
    }

    const handleOnEditCompanyName = () => {
      setEditMode(EditFormModeEnum.COMPANY)
      bottomSheetModalRef.current?.present()
    }

    const handleOnDelete = () => {
      navigation.navigate("DeleteAccount")
    }

    const handleOnFileSelected = async (brandUrl: string) => {
      // const messageMediaItemsUpdate = messageMediaItems.map((mediaItem) => mediaItem)
      // messageMediaItemsUpdate.push(newMediaItem)
      // setMessageMediaItems(messageMediaItemsUpdate)
      try {
        await mutateAsyncProfile({ BrandImageUrl: brandUrl })
        toast.success({ title: translate("common.saved") })
        handleOnCancel()
      } catch (e) {
        toast.error({ title: "Error saving" })
      }
    }

    return (
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
            <Stack space={spacing.extraSmall} px={spacing.tiny}>
              <ChangeAvatarButton onFileSelect={handleOnFileSelected} />
              <LabelValuePill.Text
                label="fieldLabels.name"
                icon="userCircle"
                text={`${userProfile.FirstName} ${userProfile.LastName}`}
                onEdit={handleOnEditName}
              />
              <LabelValuePill.Text
                label="fieldLabels.phone"
                icon="phone"
                text={runFormatPhoneSimple(userProfile.Phone)}
                onEdit={handleOnEditPhone}
              />
              <LabelValuePill.Text
                label="fieldLabels.email"
                icon="envelope"
                text={userProfile?.Email}
              />

              <LabelValuePill.Address
                label="fieldLabels.address"
                icon="mapPin"
                address1={userProfile?.Address1}
                address2={userProfile?.Address2}
                city={userProfile?.City}
                state={userProfile?.State}
                zip={userProfile?.Zip}
                onEdit={handleOnEditAddress}
                isOpen={true}
              />

              <LabelValuePill.Text
                label="fieldLabels.companyName"
                icon="briefcase"
                text={userProfile.CompanyName}
                onEdit={handleOnEditCompanyName}
              />

              <PressableActionRow
                tx="settings.deleteAccount"
                icon={{
                  icon: "trash",
                }}
                onPress={handleOnDelete}
              ></PressableActionRow>
            </Stack>
          )}
        </Box>

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
            {editMode === EditFormModeEnum.ADDRESS ? (
              <EditProfileAddressForm
                ref={formRef}
                data={{
                  Address1: userProfile.Address1,
                  Address2: userProfile.Address2,
                  City: userProfile.City,
                  State: userProfile.State,
                  Zip: userProfile.Zip,
                }}
                onSubmit={handleOnSubmitProfileAddressUpdate}
              />
            ) : null}
            {editMode === EditFormModeEnum.COMPANY ? (
              <EditProfileCompanyNameForm
                ref={formRef}
                data={{
                  CompanyName: userProfile.CompanyName,
                }}
                onSubmit={handleOnSubmitCompanyUpdate}
              />
            ) : null}
          </BottomSheetScrollView>
        </BottomSheetModal>
      </Screen>
    )
  },
)
