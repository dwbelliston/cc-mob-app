import { Avatar, IAvatarProps } from "native-base"
import React from "react"

import { ColorType } from "native-base/lib/typescript/components/types"
import { ContactSourceTypeEnum, IContact } from "../models/Contact"

const logoSrcCc = require("../../assets/images/logo-smudge-currentclient.png")
const logoSrcWb = require("../../assets/images/logo-smudge-wealthbox.png")
const logoSrcRt = require("../../assets/images/logo-smudge-redtail.png")
const logoSrcAc = require("../../assets/images/logo-smudge-agentcore.png")
const logoSrcHs = require("../../assets/images/logo-smudge-hubspot.png")

interface IProps extends IAvatarProps {
  contactSource: IContact["SourceType"]
}

export const ContactSourceAvatar = (props: IProps) => {
  const { contactSource, ...rest } = props

  const [contactSourceImg, setContactSourceImg] = React.useState<any>()
  const [contactSourceColor, setContactSourceColor] = React.useState<ColorType>("transparent")

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

  if (!contactSource) {
    return (
      <Avatar
        bg={"#2563eb"}
        _text={{
          color: "white",
          allowFontScaling: false,
        }}
        borderColor={"#2563eb"}
        borderWidth={3}
        size="md"
        source={logoSrcCc}
        {...rest}
      ></Avatar>
    )
  }

  return (
    <Avatar
      bg={contactSourceColor}
      _text={{
        color: "white",
        allowFontScaling: false,
      }}
      // borderColor={"#2563eb"}
      borderColor={contactSourceColor}
      borderWidth={3}
      size="md"
      source={contactSourceImg}
      {...rest}
    ></Avatar>
  )
}
