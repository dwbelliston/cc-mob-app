import { HStack, IStackProps, Stack } from "native-base"
import React from "react"
import { spacing } from "../theme"
import { useColor } from "../theme/useColor"
import { Icon, IconProps } from "./Icon"
import { Text, TextProps } from "./Text"

export interface IStatNumberPillTextProps extends IStackProps {
  icon?: IconProps
  label: TextProps["tx"]
  number: number
}

export const StatNumber = ({ label, icon, number, ...rest }: IStatNumberPillTextProps) => {
  const borderColor = useColor("text.softest")

  return (
    <Stack space={1} p={spacing.tiny} borderWidth={1} borderColor={borderColor} rounded="md">
      <HStack space={4} alignItems={"center"} justifyContent={"space-between"} {...rest}>
        <Text colorToken="text.soft" preset="label" tx={label}></Text>
      </HStack>

      <HStack alignItems={"center"} justifyContent={"space-between"} space={spacing.tiny}>
        {icon && <Icon colorToken={"text.soft"} size={16} {...icon} />}
        <Text flex={1} fontSize="2xl" fontWeight={"bold"} text={`${number}`}></Text>
      </HStack>
    </Stack>
  )
}

export const LabelStatPill = {
  Number: StatNumber,
}
