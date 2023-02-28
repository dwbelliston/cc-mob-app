import * as MailComposer from "expo-mail-composer"
import React from "react"
import { Platform } from "react-native"
import { useCustomToast } from "../utils/useCustomToast"
import { Icon } from "./Icon"
import { IconButton, IconButtonProps } from "./IconButton"

export interface IEmailButtonProps extends IconButtonProps {
  email: string
}

export const OpenEmailButton = ({ email, ...rest }: IEmailButtonProps) => {
  const [isEmailEnabled, setIsEmailEnabled] = React.useState<boolean>(false)

  const toast = useCustomToast()

  const handleOnEmail = React.useCallback(async () => {
    if (!isEmailEnabled) {
      // On iOS device without Mail app installed it is possible to show mail composer,
      // but it isn't possible to send that email either way.
      if (Platform.OS === "ios") {
        toast.info({
          title: "Email not configured.",
          description: "Make sure you have the Apple Mail app installed",
        })
      } else {
        toast.info({
          title: "Email not configured.",
          description: "Please let us know you want this features.",
        })
      }
      return
    }

    try {
      const { status } = await MailComposer.composeAsync({
        subject: "Hello!",
        body: "",
        recipients: [email],
        // isHtml: true,
      })
      if (status === "sent") {
        toast.success({
          title: "Sent!",
        })
      } else {
        toast.warning({
          title: "Email didnt send",
        })
      }
    } catch (e) {
      toast.warning({
        title: "Email failed",
      })
    }
  }, [])

  const checkCapabilitiesAsync = async () => {
    const isAvailable = await MailComposer.isAvailableAsync()
    setIsEmailEnabled(isAvailable)
  }

  React.useEffect(() => {
    checkCapabilitiesAsync()
  }, [])

  return (
    <IconButton
      size="sm"
      variant="subtle"
      onPress={handleOnEmail}
      icon={<Icon colorToken={"text"} icon="envelope" size={24} />}
      {...rest}
      isDisabled={!isEmailEnabled || !email}
    ></IconButton>
  )
}
