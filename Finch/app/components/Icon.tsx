import {
  ArrowLeftIcon,
  ArrowLeftOnRectangleIcon,
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
  ArrowRightIcon,
  ArrowTopRightOnSquareIcon,
  AtSymbolIcon,
  Bars3Icon,
  ChatBubbleLeftRightIcon,
  CheckIcon,
  Cog6ToothIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  EyeSlashIcon,
  FireIcon,
  HomeIcon,
  InformationCircleIcon,
  KeyIcon,
  LockClosedIcon,
  LockOpenIcon,
  UserGroupIcon,
  XMarkIcon,
} from "react-native-heroicons/outline"
import {
  ArrowLeftIcon as ArrowLeftIconSolid,
  ArrowLeftOnRectangleIcon as ArrowLeftOnRectangleIconSolid,
  ArrowLongLeftIcon as ArrowLongLeftIconSolid,
  ArrowLongRightIcon as ArrowLongRightIconSolid,
  ArrowRightIcon as ArrowRightIconSolid,
  ArrowTopRightOnSquareIcon as ArrowTopRightOnSquareIconSolid,
  AtSymbolIcon as AtSymbolIconSolid,
  Bars3Icon as Bars3IconSolid,
  ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconSolid,
  CheckIcon as CheckIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid,
  ExclamationTriangleIcon as ExclamationTriangleIconSolid,
  EyeIcon as EyeIconSolid,
  EyeSlashIcon as EyeSlashIconSolid,
  FireIcon as FireIconSolid,
  HomeIcon as HomeIconSolid,
  InformationCircleIcon as InformationCircleIconSolid,
  KeyIcon as KeyIconSolid,
  LockClosedIcon as LockClosedIconSolid,
  LockOpenIcon as LockOpenIconSolid,
  UserGroupIcon as UserGroupIconSolid,
  XMarkIcon as XMarkIconSolid,
} from "react-native-heroicons/solid"

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
  size?: number
  isOutline?: boolean
}

export const Icon = (props: IconProps) => {
  const { icon, colorToken, color, size, isOutline = true, ...iconProps } = props

  const _color = colorToken ? useColor(colorToken) : color

  let Component: any = iconRegistry[icon][isOutline ? "outline" : "solid"]

  // Guarding against nativebase 'sm' 'md' 'lg' sizing
  const iconSize = isNaN(size) ? 24 : size

  // return <Component size={size} color={_color} {...iconProps} />
  return <NBIcon as={<Component size={iconSize} />} color={_color} {...iconProps} />
}

export const iconRegistry = {
  eye: {
    outline: EyeIcon,
    solid: EyeIconSolid,
  },
  eyeSlash: {
    outline: EyeSlashIcon,
    solid: EyeSlashIconSolid,
  },
  home: {
    outline: HomeIcon,
    solid: HomeIconSolid,
  },
  settings: {
    outline: Cog6ToothIcon,
    solid: Cog6ToothIconSolid,
  },
  lockOpen: {
    outline: LockOpenIcon,
    solid: LockOpenIconSolid,
  },
  lockClosed: {
    outline: LockClosedIcon,
    solid: LockClosedIconSolid,
  },
  check: {
    outline: CheckIcon,
    solid: CheckIconSolid,
  },
  arrowRight: {
    outline: ArrowRightIcon,
    solid: ArrowRightIconSolid,
  },
  arrowRightLong: {
    outline: ArrowLongRightIcon,
    solid: ArrowLongRightIconSolid,
  },
  arrowLeft: {
    outline: ArrowLeftIcon,
    solid: ArrowLeftIconSolid,
  },
  arrowLeftLong: {
    outline: ArrowLongLeftIcon,
    solid: ArrowLongLeftIconSolid,
  },
  atSymbol: {
    outline: AtSymbolIcon,
    solid: AtSymbolIconSolid,
  },
  xMark: {
    outline: XMarkIcon,
    solid: XMarkIconSolid,
  },
  key: {
    outline: KeyIcon,
    solid: KeyIconSolid,
  },
  menu: {
    outline: Bars3Icon,
    solid: Bars3IconSolid,
  },
  chat: {
    outline: ChatBubbleLeftRightIcon,
    solid: ChatBubbleLeftRightIconSolid,
  },
  contacts: {
    outline: UserGroupIcon,
    solid: UserGroupIconSolid,
  },
  "arrow-left-on-rectangle": {
    outline: ArrowLeftOnRectangleIcon,
    solid: ArrowLeftOnRectangleIconSolid,
  },
  "exclamation-triangle": {
    outline: ExclamationTriangleIcon,
    solid: ExclamationTriangleIconSolid,
  },
  informationCircle: {
    outline: InformationCircleIcon,
    solid: InformationCircleIconSolid,
  },
  "arrow-top-right-on-square": {
    outline: ArrowTopRightOnSquareIcon,
    solid: ArrowTopRightOnSquareIconSolid,
  },
  fire: {
    outline: FireIcon,
    solid: FireIconSolid,
  },
}
