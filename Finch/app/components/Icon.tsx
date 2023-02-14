import {
  ArrowLongRightIcon,
  ArrowRightIcon,
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
  LockOpenIcon,
} from "react-native-heroicons/outline"

import { Icon as NBIcon, IIconProps as INBIconProps } from "native-base"
import * as React from "react"
import { ColorTokenOption, useColor } from "../theme/useColor"

export type IconTypes = keyof typeof iconRegistry

interface IconProps extends INBIconProps {
  /**
   * The name of the icon
   */
  icon: IconTypes
  /**
   * Color token to use
   */
  colorToken?: ColorTokenOption
}

export const Icon = (props: IconProps) => {
  const { icon, colorToken, ...iconProps } = props

  const _color = colorToken ? useColor(colorToken) : undefined

  return <NBIcon size="24" as={iconRegistry[icon]} color={_color} {...iconProps} />
}

export const iconRegistry = {
  eye: EyeIcon,
  eyeSlash: EyeSlashIcon,
  lockOpen: LockOpenIcon,
  lockClosed: LockClosedIcon,
  arrowRight: ArrowRightIcon,
  arrowRightLong: ArrowLongRightIcon,
}
