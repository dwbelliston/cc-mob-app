import { Badge as NBBadge, IBadgeProps as INBBadgeProps, useColorModeValue } from "native-base"
import React from "react"
import { Text, TextProps } from "./Text"

export interface IBadgeProps extends INBBadgeProps {
  text: TextProps
}

export const Badge = (props: IBadgeProps) => {
  const textColor = useColorModeValue(`${props.colorScheme}.600`, `${props.colorScheme}.200`)

  return (
    <NBBadge {...props}>
      <Text color={textColor} {...props.text}></Text>
    </NBBadge>
  )
}
