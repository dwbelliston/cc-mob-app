import { Image, Pressable } from "native-base"
import React from "react"

import * as Haptics from "expo-haptics"
import { ColorType } from "native-base/lib/typescript/components/types"
import { ContactSourceTypeEnum, IContact } from "../models/Contact"
import { AvatarRing, IAvatarRingProps } from "./AvatarRing"

const logoSrcWb = require("../../assets/images/logo-smudge-wealthbox.png")
const logoSrcRt = require("../../assets/images/logo-smudge-redtail.png")
const logoSrcAc = require("../../assets/images/logo-smudge-agentcore.png")
const logoSrcHs = require("../../assets/images/logo-smudge-hubspot.png")

interface IProps extends IAvatarRingProps {
  contactSource: IContact["SourceType"]
  onPress?: () => void
}

export const ContactAvatar = (props: IProps) => {
  const { onPress, contactSource, ...rest } = props

  const [contactSourceImg, setContactSourceImg] = React.useState<any>()
  const [contactSourceColor, setContactSourceColor] = React.useState<ColorType>("transparent")

  const handleOnPress = () => {
    if (onPress) {
      Haptics.selectionAsync()
      onPress()
    }
  }

  React.useEffect(() => {
    if (contactSource === ContactSourceTypeEnum.WEALTHBOX) {
      setContactSourceColor("#116ed4")
      setContactSourceImg(logoSrcWb)
    } else if (contactSource === ContactSourceTypeEnum.HUBSPOT) {
      setContactSourceColor("#ff5c35")
      setContactSourceImg(logoSrcHs)
    } else if (contactSource === ContactSourceTypeEnum.AGENTCORE) {
      setContactSourceColor("red.900")
      setContactSourceImg(logoSrcAc)
    } else if (contactSource === ContactSourceTypeEnum.REDTAIL) {
      setContactSourceColor("#ac282c")
      setContactSourceImg(logoSrcRt)
    }
  }, [contactSource])

  return (
    <Pressable onPress={handleOnPress} _pressed={{ opacity: 60 }} position="relative">
      <AvatarRing
        sourceBadge={
          contactSourceImg ? (
            <Image h={8} w={8} alt={`${contactSource} logo`} source={contactSourceImg}></Image>
          ) : null
        }
        sourceBadgeColor={contactSourceColor}
        {...rest}
      ></AvatarRing>
    </Pressable>
  )
}
