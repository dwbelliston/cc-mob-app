import * as Linking from "expo-linking"
import React from "react"
import { Platform } from "react-native"
import { useCustomToast } from "../utils/useCustomToast"
import { Icon } from "./Icon"
import { IconButton, IconButtonProps } from "./IconButton"

export interface IMapButtonProps extends IconButtonProps {
  text: string
}

export const OpenMapButton = ({ text, ...rest }: IMapButtonProps) => {
  const toast = useCustomToast()

  const openMap = async () => {
    const destination = encodeURIComponent(text)
    const provider = Platform.OS === "ios" ? "apple" : "google"
    const link = `http://maps.${provider}.com/?address=${destination}`

    try {
      const supported = await Linking.canOpenURL(link)
      if (supported) {
        Linking.openURL(link)
      } else {
        toast.warning({
          title: "Can't open address",
        })
      }
    } catch (error) {
      toast.warning({
        title: "Address lookup failed",
      })
    }
  }

  return (
    <IconButton
      size="sm"
      variant="subtle"
      onPress={openMap}
      icon={<Icon colorToken={"text"} icon="arrow-top-right-on-square" size={16} />}
      {...rest}
    ></IconButton>
  )
}
