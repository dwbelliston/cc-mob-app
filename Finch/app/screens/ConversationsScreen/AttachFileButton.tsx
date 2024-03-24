/*
AttachFileButton
*/

import { useActionSheet } from "@expo/react-native-action-sheet"
import * as DocumentPicker from "expo-document-picker"
import * as Haptics from "expo-haptics"
import * as ImagePicker from "expo-image-picker"
import { Box, HStack, Spinner } from "native-base"
import React from "react"
import { Platform } from "react-native"

import { Icon, IconButton, IconButtonProps } from "../../components"
import { IUserMediaItem } from "../../models/UserMediaItem"
import useUploadUserMedia from "../../services/api/usermedia/mutations/useUploadUserMedia"
import { spacing } from "../../theme"
import { useCustomToast } from "../../utils/useCustomToast"
import { runTodayTimestamp } from "../../utils/useFormatDate"

export interface IAttachFileButtonProps extends IconButtonProps {
  onFileSelect: (mediaItem: IUserMediaItem) => void
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

export const AttachFileButton = ({
  onFileSelect,
  documentPickerOptions,
  imagePickerOptions,
  ...rest
}: IAttachFileButtonProps) => {
  const toast = useCustomToast()

  const { mutateAsync: mutateAsyncUpload, isLoading: isLoadingUpload } = useUploadUserMedia()

  const { showActionSheetWithOptions } = useActionSheet()

  const handleOnAttach = () => {
    if (isLoadingUpload) return
    Haptics.selectionAsync()
    const options = ["Take a picture", "Choose from photos", "Attach a file", "Cancel"]
    const cancelButtonIndex = 3

    showActionSheetWithOptions(
      {
        title: "Add media file",
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

          case 2:
            handlePickFile()
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
      // quality: 0.25,
      ...imagePickerOptions,
    })

    if (!result.canceled) {
      const fileAsset = result.assets[0]
      let fileToUpload: ISelectedFile = {
        uri: fileAsset.uri,
        type: fileAsset.type,
        size: fileAsset.fileSize, // File size of the picked image or video, in bytes.
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
      // quality: 0.25,
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

  const handlePickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: false,
        type: ["image/*", "application/pdf"],
        multiple: false,
        ...documentPickerOptions,
      })

      if (result.type === "success") {
        let fileToUpload: ISelectedFile = {
          file: result.file,
          uri: result.uri,
          type: result.mimeType || "*/*",
          size: result.size,
          name: result.name,
        }

        uploadMediaFile(fileToUpload)
      }
    } catch (err) {
      toast.warning({ title: "Select file not working" })
    }
  }

  const uploadMediaFile = async (selectedFile: ISelectedFile, maxAllowSize = MAXALLOWEDSIZE) => {
    const canUpload = selectedFile.size < maxAllowSize

    if (!canUpload) {
      const fileSizeLabel = (selectedFile.size / 1024 / 1024).toFixed(1)
      toast.warning({
        title: "Too big",
        description: `Max size 5MB. Your file is ${fileSizeLabel}MB`,
      })
      return
    }

    const selectedFileUri =
      Platform.OS === "android" ? selectedFile.uri : selectedFile.uri.replace("file://", "")

    const formData: any = new FormData()
    formData.append("media", {
      uri: selectedFileUri,
      type: selectedFile.type,
      name: selectedFile.name,
    })

    try {
      const res = await mutateAsyncUpload(formData)

      if (!res.ok) {
        throw new Error()
      }

      const resJson = (await res.json()) as IUserMediaItem

      onFileSelect(resJson)
    } catch (error) {
      toast.error({ title: "Failed to upload" })
    }
  }

  return (
    <HStack space={spacing.micro} alignItems="center">
      <IconButton
        isDisabled={isLoadingUpload}
        onPress={handleOnAttach}
        rounded="full"
        size="sm"
        icon={<Icon colorToken={"text"} icon="paperClip" size={16} />}
        {...rest}
      ></IconButton>
      {isLoadingUpload && (
        <Box>
          <Spinner />
        </Box>
      )}
    </HStack>
  )
}
