import { HStack, IStackProps, Stack } from "native-base"
import React from "react"
import { IconProps } from "./Icon"
import { Text, TextProps } from "./Text"

export interface IIconValuePillBaseProps extends IStackProps {
  icon: IconProps["icon"]
  label: TextProps["tx"]
  text: TextProps["text"]
}

export const IconValuePill = ({ label, icon, text, ...rest }: IIconValuePillBaseProps) => {
  return (
    <Stack space={1}>
      <Text colorToken="text.soft" preset="label" tx={label}></Text>
      <HStack space={4} alignItems={"center"} justifyContent={"flex-start"} {...rest}>
        <Text textAlign={"center"} text={text}></Text>
      </HStack>
    </Stack>
  )
}
