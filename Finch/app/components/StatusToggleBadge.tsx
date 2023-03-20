import { Badge, Circle, IBadgeProps } from "native-base"
import React from "react"
import { translate } from "../i18n"
import { useColor } from "../theme/useColor"
import { Icon } from "./Icon"
import { TextProps } from "./Text"

interface IProps extends IBadgeProps {
  isValid: boolean
  textProps: TextProps
}

export const StatusToggleBadge = (props: IProps) => {
  const { isValid, textProps, ...rest } = props

  const successColor = useColor("success")
  const successSoftColor = useColor("success.softer")
  const textColor = useColor("text.softer")
  const bgHigherColor = useColor("bg.main")

  const i18nText = textProps.tx && translate(textProps.tx, textProps.txOptions)
  const content = i18nText || textProps.text || rest.children

  return (
    <Badge
      py={2}
      colorScheme={isValid ? "green" : "gray"}
      leftIcon={
        <Circle bg={isValid ? successSoftColor : bgHigherColor} p={0.5} mr={2}>
          {isValid ? (
            <Icon size={16} color={successColor} icon="check"></Icon>
          ) : (
            <Icon size={16} color={textColor} icon="xMark"></Icon>
          )}
        </Circle>
      }
      {...rest}
      // justifyContent="flex-start"
    >
      {content}
    </Badge>
  )
}
