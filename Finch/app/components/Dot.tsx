import { Circle, ICircleProps } from "native-base"
import React from "react"

export interface IDotProps extends ICircleProps {
  size?: DotSizes
}

const DotError = (props: IDotProps) => {
  const { ...rest } = props
  return <DotBase status="error" {...rest}></DotBase>
}

const DotSuccess = (props: IDotProps) => {
  const { ...rest } = props
  return <DotBase status="success" {...rest}></DotBase>
}

const DotInfo = (props: IDotProps) => {
  const { ...rest } = props
  return <DotBase status="info" {...rest}></DotBase>
}

const DotNeutral = (props: IDotProps) => {
  const { ...rest } = props
  return <DotBase status="neutral" {...rest}></DotBase>
}

const DotWarning = (props: IDotProps) => {
  const { ...rest } = props
  return <DotBase status="warning" {...rest}></DotBase>
}

export type DotStatuses = "info" | "success" | "error" | "warning" | "neutral"
export type DotSizes = "xs" | "sm" | "md" | "lg"

export interface IDotBaseProps extends IDotProps {
  status?: DotStatuses
}

interface StatusConfig {
  _light: {
    bg: string
  }
  _dark: {
    bg: string
  }
}

const STATUSES: Record<DotStatuses, StatusConfig> = {
  info: {
    _light: {
      bg: "primary.600",
    },
    _dark: { bg: "primary.400" },
  },
  success: {
    _light: {
      bg: "green.600",
    },
    _dark: { bg: "green.400" },
  },
  error: {
    _light: {
      bg: "error.600",
    },
    _dark: { bg: "error.400" },
  },
  warning: {
    _light: {
      bg: "amber.500",
    },
    _dark: { bg: "amber.400" },
  },
  neutral: {
    _light: {
      bg: "gray.400",
    },
    _dark: { bg: "gray.400" },
  },
}

function getStatus(status: DotStatuses) {
  return STATUSES[status]
}

const SIZES = {
  xs: {
    h: 1,
    w: 1,
  },
  sm: {
    h: 2,
    w: 2,
  },
  md: {
    h: 4,
    w: 4,
  },
  lg: {
    h: 8,
    w: 8,
  },
}

function getSize(size: DotSizes) {
  return SIZES[size]
}
const DotBase = ({ status, size = "sm", ...rest }: IDotBaseProps) => {
  const statusConfig = getStatus(status)
  const sizeConfig = getSize(size)

  return <Circle {...statusConfig} {...sizeConfig} {...rest}></Circle>
}

export const Dot = {
  Base: DotBase,
  Success: DotSuccess,
  Info: DotInfo,
  Neutral: DotNeutral,
  Error: DotError,
  Warning: DotWarning,
}
