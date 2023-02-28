import React from "react"
import { Share } from "react-native"
import { useCustomToast } from "../utils/useCustomToast"
import { Icon } from "./Icon"
import { IconButton, IconButtonProps } from "./IconButton"

export interface IShareButtonProps extends IconButtonProps {
  text: string
}

export const ShareButton = ({ text, ...rest }: IShareButtonProps) => {
  const toast = useCustomToast()

  const handleShare = async () => {
    try {
      await Share.share({
        message: text,
      })
    } catch (error: any) {
      toast.warning({ title: "Error" })
    }
  }

  return (
    <IconButton
      size="sm"
      variant="subtle"
      onPress={handleShare}
      icon={<Icon colorToken={"text"} icon="share" size={16} />}
      {...rest}
    ></IconButton>
  )
}
