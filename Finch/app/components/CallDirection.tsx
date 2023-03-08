/*
CallDirectionBadge
*/

import { Badge, Box, HStack, IBadgeProps as INBBadgeProps } from "native-base"
import React from "react"
import { CallDirectionEnum } from "../models/Call"
import { Icon } from "./Icon"
import { Text, TextProps } from "./Text"

interface IProps {
  status?: CallDirectionEnum
}

interface IBadgeProps extends INBBadgeProps, IProps {}
interface IDescriptionProps extends TextProps, IProps {}

const STYLE_MAPPING = {
  OUTBOUND: {
    color: "gray.600",
    display: "Outgoing",
    description: "You called",
  },
  INBOUND: {
    color: "amber.600",
    display: "Incoming",
    description: "Incoming call",
  },
}

const CallDirectionBadge = ({ status, ...rest }: IBadgeProps) => {
  const [display, set_display] = React.useState(STYLE_MAPPING.OUTBOUND.display)
  const [color, set_color] = React.useState(STYLE_MAPPING.OUTBOUND.color)

  React.useEffect(() => {
    let colorUpdate = STYLE_MAPPING.OUTBOUND.color
    let displayUpdate = STYLE_MAPPING.OUTBOUND.display

    if (status && STYLE_MAPPING[status]) {
      colorUpdate = STYLE_MAPPING[status].color
      displayUpdate = STYLE_MAPPING[status].display
    }
    set_color(colorUpdate)
    set_display(displayUpdate)
  }, [status])

  return (
    <Badge minWidth="24" textAlign="center" {...rest}>
      <HStack space={4} h="full" color={color}>
        <Box>
          {display === STYLE_MAPPING.OUTBOUND.display ? (
            <Icon icon="arrowUpRight"></Icon>
          ) : (
            <Icon icon="arrowDownLeft"></Icon>
          )}
        </Box>

        <Text>{display}</Text>
      </HStack>
    </Badge>
  )
}

const CallDirectionDescription = ({ status, ...rest }: IDescriptionProps) => {
  const [description, set_description] = React.useState(STYLE_MAPPING.OUTBOUND.description)

  React.useEffect(() => {
    let descriptionUpdate = STYLE_MAPPING.OUTBOUND.description

    if (status && STYLE_MAPPING[status]) {
      descriptionUpdate = STYLE_MAPPING[status].description
    }

    set_description(descriptionUpdate)
  }, [status])

  return <Text {...rest}>{description}</Text>
}

export default {
  Badge: CallDirectionBadge,
  Description: CallDirectionDescription,
}
