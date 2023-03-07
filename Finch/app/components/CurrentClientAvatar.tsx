import { Avatar, IAvatarProps } from "native-base"
import React from "react"

const logoSrcCc = require("../../assets/images/logo-smudge-currentclient.png")

export const CurrentClientAvatar = (props: IAvatarProps) => {
  return (
    <Avatar
      bg={"#60a5fa"}
      _text={{
        color: "white",
        allowFontScaling: false,
      }}
      borderColor={"#60a5fa"}
      borderWidth={1}
      size="md"
      source={logoSrcCc}
      {...props}
    ></Avatar>
  )
}
