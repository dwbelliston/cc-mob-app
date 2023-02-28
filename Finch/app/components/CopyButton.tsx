import * as Clipboard from "expo-clipboard"
import React from "react"
import { useCustomToast } from "../utils/useCustomToast"
import { Icon } from "./Icon"
import { IconButton, IconButtonProps } from "./IconButton"

export interface ICopyButtonProps extends IconButtonProps {
  text: string
}

export const CopyButton = ({ text, ...rest }: ICopyButtonProps) => {
  const toast = useCustomToast()

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(text)
    toast.success({ title: "Copied", description: text })
  }

  return (
    <IconButton
      size="sm"
      variant="subtle"
      onPress={copyToClipboard}
      icon={<Icon colorToken={"text"} icon="documentDuplicate" size={16} />}
      {...rest}
    ></IconButton>
  )
}
