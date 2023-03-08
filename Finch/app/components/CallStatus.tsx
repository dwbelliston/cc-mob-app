/*
CallStatusBadge
*/

import { Badge, Circle } from "native-base"
import React from "react"

import { CallDirectionEnum, CallStatusEnum, ICall } from "../models/Call"
import { runFormatPhoneSimple } from "../utils/useFormatPhone"
import { Icon, IconProps } from "./Icon"
import { Text, TextProps } from "./Text"

interface IProps {
  status?: CallStatusEnum
}

interface IForwardedProps extends TextProps {
  callIsForwarded: ICall["IsForwarded"]
  callNumberForwardedTo: ICall["NumberForwardedTo"]
}
interface IOutsideHours extends TextProps {
  callIsOutsideHours: ICall["IsForwarded"]
}

interface IDescriptionProps extends TextProps, IProps {}

interface IIconProps extends TextProps, IProps {
  direction?: CallDirectionEnum
}

const STYLE_MAPPING = {
  [CallStatusEnum.CREATED]: {
    colorScheme: "gray",
    description: "Call starting",
    icon: {
      [CallDirectionEnum.INBOUND]: {
        bg: "green.500",
        icon: "phoneArrowDownLeft",
      },
      [CallDirectionEnum.OUTBOUND]: {
        bg: "amber.500",
        icon: "phoneArrowUpRight",
      },
    },
  },
  [CallStatusEnum.INITIATED]: {
    colorScheme: "amber",
    description: "Call starting",
    isPulse: true,
    icon: {
      [CallDirectionEnum.INBOUND]: {
        bg: "green.500",
        icon: "phoneArrowDownLeft",
      },
      [CallDirectionEnum.OUTBOUND]: {
        bg: "amber.500",
        icon: "phoneArrowUpRight",
      },
    },
  },
  [CallStatusEnum.RINGING]: {
    colorScheme: "amber",
    description: "Ringing",
    isPulse: true,
    icon: {
      [CallDirectionEnum.INBOUND]: {
        bg: "green.500",
        icon: "phoneArrowDownLeft",
      },
      [CallDirectionEnum.OUTBOUND]: {
        bg: "amber.500",
        icon: "phoneArrowUpRight",
      },
    },
  },
  [CallStatusEnum.INPROGRESS]: {
    colorScheme: "amber",
    description: "Call in progress",
    isPulse: true,
    icon: {
      [CallDirectionEnum.INBOUND]: {
        bg: "amber.500",
        icon: "phoneArrowDownLeft",
      },
      [CallDirectionEnum.OUTBOUND]: {
        bg: "amber.500",
        icon: "phoneArrowUpRight",
      },
    },
  },
  [CallStatusEnum.COMPLETED]: {
    colorScheme: "green",
    description: "Call ended",
    icon: {
      [CallDirectionEnum.INBOUND]: {
        bg: "primary.700",
        icon: "phoneArrowDownLeft",
      },
      [CallDirectionEnum.OUTBOUND]: {
        bg: "primary.700",
        icon: "phoneArrowUpRight",
      },
    },
  },
  [CallStatusEnum.FAILED]: {
    colorScheme: "red",
    description: "Call failed",
    icon: {
      [CallDirectionEnum.INBOUND]: {
        bg: "red.600",
        icon: "phoneXMark",
      },
      [CallDirectionEnum.OUTBOUND]: {
        bg: "red.600",
        icon: "phoneXMark",
      },
    },
  },
  [CallStatusEnum.BUSY]: {
    colorScheme: "gray",
    description: "Missed call",
    icon: {
      [CallDirectionEnum.INBOUND]: {
        bg: "red.600",
        icon: "phoneXMark",
      },
      [CallDirectionEnum.OUTBOUND]: {
        bg: "red.600",
        icon: "phoneXMark",
      },
    },
  },
  [CallStatusEnum.NOANSWER]: {
    colorScheme: "gray",
    description: "Missed call",
    icon: {
      [CallDirectionEnum.INBOUND]: {
        bg: "red.600",
        icon: "phoneXMark",
      },
      [CallDirectionEnum.OUTBOUND]: {
        bg: "red.600",
        icon: "phoneXMark",
      },
    },
  },
  [CallStatusEnum.CANCELED]: {
    colorScheme: "gray",
    description: "Call was canceled",
    icon: {
      [CallDirectionEnum.INBOUND]: {
        bg: "gray.700",
        icon: "phoneXMark",
      },
      [CallDirectionEnum.OUTBOUND]: {
        bg: "gray.700",
        icon: "phoneXMark",
      },
    },
  },
}

const CallStatusBadge = ({ status }: IProps) => {
  const [colorScheme, set_colorScheme] = React.useState<string>("primary")
  const [isPulse, set_isPulse] = React.useState<boolean>()

  React.useEffect(() => {
    let colorSchemeUpdate = "primary"
    let isPulseUpdate = false

    if (status && STYLE_MAPPING[status]) {
      colorSchemeUpdate = STYLE_MAPPING[status].colorScheme
      isPulseUpdate = STYLE_MAPPING[status]["isPulse"]
    }
    set_colorScheme(colorSchemeUpdate)
    set_isPulse(isPulseUpdate)
  }, [status])

  return (
    <Badge
      // style={{
      //   animation: isPulse ? "pulse 2s infinite linear" : "",
      // }}
      minWidth="24"
      textAlign="center"
      colorScheme={colorScheme}
    >
      {status}
    </Badge>
  )
}

export const getCallStatusDescription = (
  status: CallStatusEnum | undefined,
): string | undefined => {
  let description: string | undefined

  if (status && STYLE_MAPPING[status]) {
    description = STYLE_MAPPING[status].description
  }

  return description
}

export const useCallStatusDescription = (
  status: CallStatusEnum | undefined,
): string | undefined => {
  const [description, setDescription] = React.useState<string>()

  React.useEffect(() => {
    setDescription(getCallStatusDescription(status))
  }, [status])

  return description
}

const CallStatusDescription = ({ status, ...rest }: IDescriptionProps) => {
  const description = useCallStatusDescription(status)

  return <Text text={description} {...rest}></Text>
}

const CallStatusForwarded = ({
  callIsForwarded,
  callNumberForwardedTo,
  ...rest
}: IForwardedProps) => {
  if (!callIsForwarded) {
    return <></>
  }

  return <Text {...rest}>Forward to {runFormatPhoneSimple(callNumberForwardedTo)}</Text>
}

const CallStatusOutsideHours = ({ callIsOutsideHours, ...rest }: IOutsideHours) => {
  if (!callIsOutsideHours) {
    return <></>
  }

  return <Text {...rest}>Outside Hours</Text>
}

const CallStatusIcon = ({ status, direction, ...rest }: IIconProps) => {
  const [bg, set_bg] = React.useState()
  const [icon, set_icon] = React.useState<IconProps["icon"]>("phone")
  const [isPulse, set_isPulse] = React.useState<boolean>()

  React.useEffect(() => {
    let bgUpdate
    let iconUpdate
    let isPulseUpdate = false

    try {
      if (status && direction && STYLE_MAPPING[status].icon[direction]) {
        bgUpdate = STYLE_MAPPING[status].icon[direction].bg
        iconUpdate = STYLE_MAPPING[status].icon[direction].icon
        isPulseUpdate = STYLE_MAPPING[status]["isPulse"]
      }
    } catch (e) {}

    set_bg(bgUpdate)
    set_icon(iconUpdate)
    set_isPulse(isPulseUpdate)
  }, [status])

  return (
    <Circle
      bg={bg}
      p={3}
      // style={{
      //   animation: isPulse ? "pulse 2s infinite linear" : "",
      // }}
    >
      <Icon color="white" size={16} icon={icon}></Icon>
    </Circle>
  )
}

export default {
  Badge: CallStatusBadge,
  Description: CallStatusDescription,
  Icon: CallStatusIcon,
  Forwarded: CallStatusForwarded,
  OutideHours: CallStatusOutsideHours,
}
