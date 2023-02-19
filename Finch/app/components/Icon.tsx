import {
  ArrowDownLeftIcon,
  ArrowDownRightIcon,
  ArrowLeftIcon,
  ArrowLeftOnRectangleIcon,
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
  ArrowRightIcon,
  ArrowTopRightOnSquareIcon,
  ArrowUpRightIcon,
  AtSymbolIcon,
  Bars3Icon,
  BellAlertIcon,
  BellIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  CheckIcon,
  Cog6ToothIcon,
  EllipsisHorizontalIcon,
  EllipsisVerticalIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  EyeSlashIcon,
  FireIcon,
  HandThumbUpIcon,
  HashtagIcon,
  HomeIcon,
  InboxArrowDownIcon,
  InboxIcon,
  InboxStackIcon,
  InformationCircleIcon,
  KeyIcon,
  LockClosedIcon,
  LockOpenIcon,
  PhoneArrowDownLeftIcon,
  PhoneIcon,
  RocketLaunchIcon,
  SparklesIcon,
  StarIcon,
  UserCircleIcon,
  UserGroupIcon,
  UserIcon,
  XMarkIcon,
} from "react-native-heroicons/outline"
import {
  ArrowDownLeftIcon as ArrowDownLeftIconSolid,
  ArrowDownRightIcon as ArrowDownRightIconSolid,
  ArrowLeftIcon as ArrowLeftIconSolid,
  ArrowLeftOnRectangleIcon as ArrowLeftOnRectangleIconSolid,
  ArrowLongLeftIcon as ArrowLongLeftIconSolid,
  ArrowLongRightIcon as ArrowLongRightIconSolid,
  ArrowRightIcon as ArrowRightIconSolid,
  ArrowTopRightOnSquareIcon as ArrowTopRightOnSquareIconSolid,
  ArrowUpRightIcon as ArrowUpRightIconSolid,
  AtSymbolIcon as AtSymbolIconSolid,
  Bars3Icon as Bars3IconSolid,
  BellAlertIcon as BellAlertIconSolid,
  BellIcon as BellIconSolid,
  ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconSolid,
  CheckCircleIcon as CheckCircleIconSolid,
  CheckIcon as CheckIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid,
  EllipsisHorizontalIcon as EllipsisHorizontalIconSolid,
  EllipsisVerticalIcon as EllipsisVerticalIconSolid,
  ExclamationTriangleIcon as ExclamationTriangleIconSolid,
  EyeIcon as EyeIconSolid,
  EyeSlashIcon as EyeSlashIconSolid,
  FireIcon as FireIconSolid,
  HandThumbUpIcon as HandThumbUpIconSolid,
  HashtagIcon as HashtagIconSolid,
  HomeIcon as HomeIconSolid,
  InboxArrowDownIcon as InboxArrowDownIconSolid,
  InboxIcon as InboxIconSolid,
  InboxStackIcon as InboxStackIconSolid,
  InformationCircleIcon as InformationCircleIconSolid,
  KeyIcon as KeyIconSolid,
  LockClosedIcon as LockClosedIconSolid,
  LockOpenIcon as LockOpenIconSolid,
  PhoneArrowDownLeftIcon as PhoneArrowDownLeftIconSolid,
  PhoneIcon as PhoneIconSolid,
  RocketLaunchIcon as RocketLaunchIconSolid,
  SparklesIcon as SparklesIconSolid,
  StarIcon as StarIconSolid,
  UserCircleIcon as UserCircleIconSolid,
  UserGroupIcon as UserGroupIconSolid,
  UserIcon as UserIconSolid,
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
  star: {
    outline: StarIcon,
    solid: StarIconSolid,
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
  checkCircle: {
    outline: CheckCircleIcon,
    solid: CheckCircleIconSolid,
  },
  arrowRight: {
    outline: ArrowRightIcon,
    solid: ArrowRightIconSolid,
  },
  sparkles: {
    outline: SparklesIcon,
    solid: SparklesIconSolid,
  },
  handThumbUp: {
    outline: HandThumbUpIcon,
    solid: HandThumbUpIconSolid,
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
  arrowDownRight: {
    outline: ArrowDownRightIcon,
    solid: ArrowDownRightIconSolid,
  },
  arrowDownLeft: {
    outline: ArrowDownLeftIcon,
    solid: ArrowDownLeftIconSolid,
  },
  arrowUpRight: {
    outline: ArrowUpRightIcon,
    solid: ArrowUpRightIconSolid,
  },

  "arrow-top-right-on-square": {
    outline: ArrowTopRightOnSquareIcon,
    solid: ArrowTopRightOnSquareIconSolid,
  },
  fire: {
    outline: FireIcon,
    solid: FireIconSolid,
  },
  hashtag: {
    outline: HashtagIcon,
    solid: HashtagIconSolid,
  },
  phone: {
    outline: PhoneIcon,
    solid: PhoneIconSolid,
  },
  phoneArrowDownLeft: {
    outline: PhoneArrowDownLeftIcon,
    solid: PhoneArrowDownLeftIconSolid,
  },
  bell: {
    outline: BellIcon,
    solid: BellIconSolid,
  },
  bellAlert: {
    outline: BellAlertIcon,
    solid: BellAlertIconSolid,
  },
  user: {
    outline: UserIcon,
    solid: UserIconSolid,
  },
  userCircle: {
    outline: UserCircleIcon,
    solid: UserCircleIconSolid,
  },
  ellipsisVertical: {
    outline: EllipsisVerticalIcon,
    solid: EllipsisVerticalIconSolid,
  },
  ellipsisHorizontal: {
    outline: EllipsisHorizontalIcon,
    solid: EllipsisHorizontalIconSolid,
  },
  rocketLaunch: {
    outline: RocketLaunchIcon,
    solid: RocketLaunchIconSolid,
  },
  inboxStack: {
    outline: InboxStackIcon,
    solid: InboxStackIconSolid,
  },
  inboxArrowDown: {
    outline: InboxArrowDownIcon,
    solid: InboxArrowDownIconSolid,
  },
  inbox: {
    outline: InboxIcon,
    solid: InboxIconSolid,
  },
}
