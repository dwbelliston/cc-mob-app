/*
CallStatusBadge
*/

import { Badge, Circle, Icon, ITextProps } from "native-base"
import React from "react"
import {
  PhoneArrowDownLeftIcon,
  PhoneArrowUpRightIcon,
  PhoneXMarkIcon,
} from "react-native-heroicons/outline"
import { CallDirectionEnum, CallStatusEnum, ICall } from "../models/Call"
import { runFormatPhoneSimple } from "../utils/useFormatPhone"
import { Text } from "./Text"

interface IProps {
  status?: CallStatusEnum
}

interface IForwardedProps extends ITextProps {
  call?: ICall
}

interface IDescriptionProps extends ITextProps, IProps {}

interface IIconProps extends ITextProps, IProps {
  direction?: CallDirectionEnum
}

const STYLE_MAPPING = {
  [CallStatusEnum.CREATED]: {
    colorScheme: "gray",
    description: "Call starting",
    icon: {
      [CallDirectionEnum.INBOUND]: {
        bg: "green.500",
        icon: PhoneArrowDownLeftIcon,
      },
      [CallDirectionEnum.OUTBOUND]: {
        bg: "amber.500",
        icon: PhoneArrowUpRightIcon,
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
        icon: PhoneArrowDownLeftIcon,
      },
      [CallDirectionEnum.OUTBOUND]: {
        bg: "amber.500",
        icon: PhoneArrowUpRightIcon,
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
        icon: PhoneArrowDownLeftIcon,
      },
      [CallDirectionEnum.OUTBOUND]: {
        bg: "amber.500",
        icon: PhoneArrowUpRightIcon,
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
        icon: PhoneArrowDownLeftIcon,
      },
      [CallDirectionEnum.OUTBOUND]: {
        bg: "amber.500",
        icon: PhoneArrowUpRightIcon,
      },
    },
  },
  [CallStatusEnum.COMPLETED]: {
    colorScheme: "green",
    description: "Call ended",
    icon: {
      [CallDirectionEnum.INBOUND]: {
        bg: "primary.700",
        icon: PhoneArrowDownLeftIcon,
      },
      [CallDirectionEnum.OUTBOUND]: {
        bg: "primary.700",
        icon: PhoneArrowUpRightIcon,
      },
    },
  },
  [CallStatusEnum.FAILED]: {
    colorScheme: "red",
    description: "Call failed",
    icon: {
      [CallDirectionEnum.INBOUND]: {
        bg: "red.600",
        icon: PhoneXMarkIcon,
      },
      [CallDirectionEnum.OUTBOUND]: {
        bg: "red.600",
        icon: PhoneXMarkIcon,
      },
    },
  },
  [CallStatusEnum.BUSY]: {
    colorScheme: "gray",
    description: "Missed call",
    icon: {
      [CallDirectionEnum.INBOUND]: {
        bg: "red.600",
        icon: PhoneXMarkIcon,
      },
      [CallDirectionEnum.OUTBOUND]: {
        bg: "red.600",
        icon: PhoneXMarkIcon,
      },
    },
  },
  [CallStatusEnum.NOANSWER]: {
    colorScheme: "gray",
    description: "Missed call",
    icon: {
      [CallDirectionEnum.INBOUND]: {
        bg: "red.600",
        icon: PhoneXMarkIcon,
      },
      [CallDirectionEnum.OUTBOUND]: {
        bg: "red.600",
        icon: PhoneXMarkIcon,
      },
    },
  },
  [CallStatusEnum.CANCELED]: {
    colorScheme: "gray",
    description: "Call was canceled",
    icon: {
      [CallDirectionEnum.INBOUND]: {
        bg: "gray.700",
        icon: PhoneXMarkIcon,
      },
      [CallDirectionEnum.OUTBOUND]: {
        bg: "gray.700",
        icon: PhoneXMarkIcon,
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

export const useCallStatusDescription = (
  status: CallStatusEnum | undefined,
): string | undefined => {
  const [description, set_description] = React.useState()

  React.useEffect(() => {
    let descriptionUpdate

    if (status && STYLE_MAPPING[status]) {
      descriptionUpdate = STYLE_MAPPING[status].description
    }

    set_description(descriptionUpdate)
  }, [status])

  return description
}

const CallStatusDescription = ({ status, ...rest }: IDescriptionProps) => {
  const description = useCallStatusDescription(status)

  return <Text text={description} {...rest}></Text>
}

const CallStatusForwarded = ({ call, ...rest }: IForwardedProps) => {
  if (!call?.IsForwarded) {
    return <></>
  }

  return <Text {...rest}>Forward to {runFormatPhoneSimple(call?.NumberForwardedTo)}</Text>
}

const CallStatusOutsideHours = ({ call, ...rest }: IForwardedProps) => {
  if (!call?.IsOutsideHours) {
    return <></>
  }

  return <Text {...rest}>Outside Hours</Text>
}

const CallStatusIcon = ({ status, direction, ...rest }: IIconProps) => {
  const [bg, set_bg] = React.useState()
  const [icon, set_icon] = React.useState()
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
      <Icon color="white" as={icon}></Icon>
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
