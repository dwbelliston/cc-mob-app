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
  const [isAddressValid, setIsAddressValid] = React.useState<boolean>(false)
  const [addressLink, setAddressLink] = React.useState<string>("")

  const toast = useCustomToast()

  const openMap = async () => {
    try {
      const supported = await Linking.canOpenURL(addressLink)
      if (supported) {
        Linking.openURL(addressLink)
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

  const checkCapabilitiesAsync = async () => {
    const destination = encodeURIComponent(text)
    const provider = Platform.OS === "ios" ? "apple" : "google"
    const link = `http://maps.${provider}.com/?address=${destination}`

    setAddressLink(link)

    try {
      const supported = await Linking.canOpenURL(link)
      setIsAddressValid(supported)
    } catch (error) {
      setIsAddressValid(false)
    }
  }

  React.useEffect(() => {
    checkCapabilitiesAsync()
  }, [text])

  return (
    <IconButton
      size="sm"
      variant="subtle"
      onPress={openMap}
      icon={<Icon colorToken={"text"} icon="arrow-top-right-on-square" size={16} />}
      {...rest}
      isDisabled={!isAddressValid}
    ></IconButton>
  )
}
