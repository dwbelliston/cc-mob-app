/*
ChangeAvatarButton

TODO: Lotsof dupe code compared to the attach file button
*/

import { useActionSheet } from "@expo/react-native-action-sheet"
import * as DocumentPicker from "expo-document-picker"
import * as Haptics from "expo-haptics"
import * as ImagePicker from "expo-image-picker"
import { Box, Spinner, Stack } from "native-base"
import React from "react"
import { Platform } from "react-native"

import { IconButtonProps, Text } from "../../../components"
import { UserAvatar } from "../../../components/UserAvatar"
import useUploadUserAvatar from "../../../services/api/userprofile/mutations/useUploadUserAvatar"
import { spacing } from "../../../theme"
import { useCustomToast } from "../../../utils/useCustomToast"
import { runTodayTimestamp } from "../../../utils/useFormatDate"

export interface IChangeAvatarButtonProps extends IconButtonProps {
  onFileSelect: (brandUrl: string) => void
  imagePickerOptions?: ImagePicker.ImagePickerOptions
  documentPickerOptions?: DocumentPicker.DocumentPickerOptions
}

const MAXALLOWEDSIZE = 5 * 1024 * 1024

export interface ISelectedFile {
  file?: File
  uri: string
  type: string
  size?: number
  name: string
}

export const ChangeAvatarButton = ({
  onFileSelect,
  documentPickerOptions,
  imagePickerOptions,
  ...rest
}: IChangeAvatarButtonProps) => {
  const toast = useCustomToast()

  const { mutateAsync: mutateAsyncUpload, isLoading: isLoadingUpload } = useUploadUserAvatar()

  const { showActionSheetWithOptions } = useActionSheet()

  const handleOnAttach = () => {
    if (isLoadingUpload) return
    Haptics.selectionAsync()
    const options = ["Take a picture", "Choose from photos", "Cancel"]
    const cancelButtonIndex = 2

    showActionSheetWithOptions(
      {
        title: "Change Profile",
        options,
        cancelButtonIndex,
        // destructiveButtonIndex,
      },
      (selectedIndex: number) => {
        switch (selectedIndex) {
          case 0:
            handleTakePicture()
            // Block
            break

          case 1:
            handlePickImage()
            break

          case cancelButtonIndex:
          // Canceled
        }
      },
    )
  }

  const handleTakePicture = async () => {
    let permissionResult = await ImagePicker.requestCameraPermissionsAsync()

    if (permissionResult.granted === false) {
      toast.warning({ title: "Permissions limited" })
      return
    }

    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      allowsMultipleSelection: false,
      quality: 0.25,
      ...imagePickerOptions,
    })

    if (!result.canceled) {
      const fileAsset = result.assets[0]
      let fileToUpload: ISelectedFile = {
        uri: fileAsset.uri,
        type: fileAsset.type,
        size: fileAsset.fileSize,
        name: `${runTodayTimestamp()}.png`,
      }

      uploadMediaFile(fileToUpload)
    }
  }

  const handlePickImage = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (permissionResult.granted === false) {
      toast.warning({ title: "Permissions limited" })
      return
    }

    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      allowsMultipleSelection: false,
      quality: 0.25,
      ...imagePickerOptions,
    })

    if (!result.canceled) {
      const fileAsset = result.assets[0]
      let fileToUpload: ISelectedFile = {
        uri: fileAsset.uri,
        type: fileAsset.type,
        size: fileAsset.fileSize,
        name: fileAsset.fileName,
      }

      uploadMediaFile(fileToUpload)
    }
  }

  const uploadMediaFile = async (selectedFile: ISelectedFile, maxAllowSize = MAXALLOWEDSIZE) => {
    const canUpload = selectedFile.size < maxAllowSize

    if (!canUpload) {
      toast.warning({ title: "File too big", description: selectedFile.name })
      return
    }

    const selectedFileUri =
      Platform.OS === "android" ? selectedFile.uri : selectedFile.uri.replace("file://", "")

    const formData: any = new FormData()
    formData.append("image", {
      uri: selectedFileUri,
      type: selectedFile.type,
      name: selectedFile.name,
    })

    try {
      const res = await mutateAsyncUpload(formData)

      if (!res.ok) {
        throw new Error()
      }

      const resJson = (await res.json()) as { BrandImageUrl: string }

      console.log("resJson", resJson)

      onFileSelect(resJson.BrandImageUrl)
    } catch (error) {
      toast.error({ title: "Failed to upload" })
    }
  }

  return (
    <Stack space={spacing.micro}>
      <UserAvatar isShowLoading={false} size="xl" onPress={handleOnAttach}></UserAvatar>
      <Text colorToken={"text.softer"} textAlign="center" tx="common.tapToEdit"></Text>
      {isLoadingUpload && (
        <Box>
          <Spinner />
        </Box>
      )}
    </Stack>
  )
}
