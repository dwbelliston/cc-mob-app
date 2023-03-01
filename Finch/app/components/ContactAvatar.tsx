import { Pressable } from "native-base"
import React from "react"

import * as Haptics from "expo-haptics"
import { IContact } from "../models/Contact"
import { AvatarRing, IAvatarRingProps } from "./AvatarRing"
import { ContactSourceAvatar } from "./ContactSourceAvatar"

interface IProps extends IAvatarRingProps {
  contactSource?: IContact["SourceType"]
  onPress?: () => void
}

export const ContactAvatar = (props: IProps) => {
  const { onPress, contactSource, ...rest } = props

  const handleOnPress = () => {
    if (onPress) {
      Haptics.selectionAsync()
      onPress()
    }
  }

  return (
    <Pressable onPress={handleOnPress} _pressed={{ opacity: 60 }} position="relative">
      <AvatarRing
        sourceBadge={
          contactSource ? (
            <ContactSourceAvatar
              size={rest.avatarProps?.size === "sm" ? "xs" : "sm"}
              contactSource={contactSource}
            />
          ) : null
        }
        {...rest}
      ></AvatarRing>
    </Pressable>
  )
}
