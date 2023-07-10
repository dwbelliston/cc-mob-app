import { Pressable } from "native-base"
import React from "react"

import * as Haptics from "expo-haptics"
import { IContact } from "../models/Contact"
import useReadContact from "../services/api/contacts/queries/useReadContact"
import { AvatarRing, IAvatarRingProps } from "./AvatarRing"
import { ContactSourceAvatar } from "./ContactSourceAvatar"

interface IProps extends IAvatarRingProps {
  contactSource?: IContact["SourceType"]
  onPress?: () => void
  contactId?: string
}

export const ContactAvatar = (props: IProps) => {
  const { onPress, contactSource, contactId, ...rest } = props

  const { data: dataContact } = useReadContact(contactId)

  const handleOnPress = () => {
    if (onPress) {
      Haptics.selectionAsync()
      onPress()
    }
  }

  return (
    <Pressable onPress={handleOnPress} _pressed={{ opacity: 60 }} position="relative">
      <AvatarRing
        avatarUrl={dataContact?.AvatarUrl}
        sourceBadge={
          contactSource ? (
            <ContactSourceAvatar
              size={rest.avatarProps?.size === "sm" ? "5" : "sm"}
              contactSource={contactSource}
            />
          ) : null
        }
        {...rest}
      ></AvatarRing>
    </Pressable>
  )
}
