import { HStack, IStackProps } from "native-base"
import React from "react"
import { Icon, IconProps } from "./Icon"
import { Text, TextProps } from "./Text"

export interface IIconValuePillBaseProps extends IStackProps {
  icon: IconProps["icon"]
  text: TextProps["text"]
}

export const IconValuePill = ({ icon, text, ...rest }: IIconValuePillBaseProps) => {
  return (
    <HStack space={4} alignItems={"center"} justifyContent={"flex-start"} {...rest}>
      <Icon colorToken={"text.softer"} size={20} icon={icon} isOutline={false}></Icon>
      <Text textAlign={"center"} text={text}></Text>
    </HStack>
  )
}
