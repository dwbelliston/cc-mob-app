import {
  ArrowDownLeftIcon,
  ArrowDownRightIcon,
  ArrowLeftIcon,
  ArrowLeftOnRectangleIcon,
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
  ArrowRightIcon,
  ArrowTopRightOnSquareIcon,
  ArrowUpIcon,
  ArrowUpRightIcon,
  AtSymbolIcon,
  Bars3Icon,
  BellAlertIcon,
  BellIcon,
  BoltIcon,
  BriefcaseIcon,
  CakeIcon,
  ChatBubbleBottomCenterTextIcon,
  ChatBubbleLeftEllipsisIcon,
  ChatBubbleLeftIcon,
  ChatBubbleLeftRightIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  CheckCircleIcon,
  CheckIcon,
  ChevronRightIcon,
  ClipboardDocumentCheckIcon,
  ClockIcon,
  CloudArrowDownIcon,
  Cog6ToothIcon,
  CreditCardIcon,
  DocumentDuplicateIcon,
  EllipsisHorizontalIcon,
  EllipsisVerticalIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  EyeSlashIcon,
  FingerPrintIcon,
  FireIcon,
  FunnelIcon,
  HandThumbUpIcon,
  HashtagIcon,
  HomeIcon,
  IdentificationIcon,
  InboxArrowDownIcon,
  InboxIcon,
  InboxStackIcon,
  InformationCircleIcon,
  KeyIcon,
  LifebuoyIcon,
  LinkIcon,
  LockClosedIcon,
  LockOpenIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  NoSymbolIcon,
  PaperAirplaneIcon,
  PaperClipIcon,
  PauseIcon,
  PencilIcon,
  PencilSquareIcon,
  PhoneArrowDownLeftIcon,
  PhoneArrowUpRightIcon,
  PhoneIcon,
  PhoneXMarkIcon,
  PhotoIcon,
  PlayIcon,
  RocketLaunchIcon,
  ScaleIcon,
  ShareIcon,
  ShieldCheckIcon,
  SparklesIcon,
  StarIcon,
  StopIcon,
  TagIcon,
  TrashIcon,
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
  ArrowUpIcon as ArrowUpIconSolid,
  ArrowUpRightIcon as ArrowUpRightIconSolid,
  AtSymbolIcon as AtSymbolIconSolid,
  Bars3Icon as Bars3IconSolid,
  BellAlertIcon as BellAlertIconSolid,
  BellIcon as BellIconSolid,
  BoltIcon as BoltIconSolid,
  BriefcaseIcon as BriefcaseIconSolid,
  CakeIcon as CakeIconSolid,
  ChatBubbleBottomCenterTextIcon as ChatBubbleBottomCenterTextIconSolid,
  ChatBubbleLeftEllipsisIcon as ChatBubbleLeftEllipsisIconSolid,
  ChatBubbleLeftIcon as ChatBubbleLeftIconSolid,
  ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconSolid,
  CheckCircleIcon as CheckCircleIconSolid,
  CheckIcon as CheckIconSolid,
  ChevronRightIcon as ChevronRightIconSolid,
  ClipboardDocumentCheckIcon as ClipboardDocumentCheckIconSolid,
  ClockIcon as ClockIconSolid,
  CloudArrowDownIcon as CloudArrowDownIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid,
  CreditCardIcon as CreditCardIconSolid,
  DocumentDuplicateIcon as DocumentDuplicateIconSolid,
  EllipsisHorizontalIcon as EllipsisHorizontalIconSolid,
  EllipsisVerticalIcon as EllipsisVerticalIconSolid,
  EnvelopeIcon as EnvelopeIconSolid,
  ExclamationTriangleIcon as ExclamationTriangleIconSolid,
  EyeIcon as EyeIconSolid,
  EyeSlashIcon as EyeSlashIconSolid,
  FingerPrintIcon as FingerPrintIconSolid,
  FireIcon as FireIconSolid,
  FunnelIcon as FunnelIconSolid,
  HandThumbUpIcon as HandThumbUpIconSolid,
  HashtagIcon as HashtagIconSolid,
  HomeIcon as HomeIconSolid,
  IdentificationIcon as IdentificationIconSolid,
  InboxArrowDownIcon as InboxArrowDownIconSolid,
  InboxIcon as InboxIconSolid,
  InboxStackIcon as InboxStackIconSolid,
  InformationCircleIcon as InformationCircleIconSolid,
  KeyIcon as KeyIconSolid,
  LifebuoyIcon as LifebuoyIconSolid,
  LinkIcon as LinkIconSolid,
  LockClosedIcon as LockClosedIconSolid,
  LockOpenIcon as LockOpenIconSolid,
  MagnifyingGlassIcon as MagnifyingGlassIconSolid,
  MapPinIcon as MapPinIconSolid,
  NoSymbolIcon as NoSymbolIconSolid,
  PaperAirplaneIcon as PaperAirplaneIconSolid,
  PaperClipIcon as PaperClipIconSolid,
  PauseIcon as PauseIconSolid,
  PencilIcon as PencilIconSolid,
  PencilSquareIcon as PencilSquareIconSolid,
  PhoneArrowDownLeftIcon as PhoneArrowDownLeftIconSolid,
  PhoneArrowUpRightIcon as PhoneArrowUpRightIconSolid,
  PhoneIcon as PhoneIconSolid,
  PhoneXMarkIcon as PhoneXMarkIconSolid,
  PhotoIcon as PhotoIconSolid,
  PlayIcon as PlayIconSolid,
  RocketLaunchIcon as RocketLaunchIconSolid,
  ScaleIcon as ScaleIconSolid,
  ShareIcon as ShareIconSolid,
  ShieldCheckIcon as ShieldCheckIconSolid,
  SparklesIcon as SparklesIconSolid,
  StarIcon as StarIconSolid,
  StopIcon as StopIconSolid,
  TagIcon as TagIconSolid,
  TrashIcon as TrashIconSolid,
  UserCircleIcon as UserCircleIconSolid,
  UserGroupIcon as UserGroupIconSolid,
  UserIcon as UserIconSolid,
  XMarkIcon as XMarkIconSolid,
} from "react-native-heroicons/solid"

import { Icon as NBIcon, IIconProps as INBIconProps } from "native-base"
import * as React from "react"
import { ColorTokenOption, useColor } from "../theme/useColor"

export type IconTypes = keyof typeof iconRegistry

export interface IconProps extends INBIconProps {
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
  bolt: {
    outline: BoltIcon,
    solid: BoltIconSolid,
  },
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
  cloudArrowUp: {
    outline: CloudArrowDownIcon,
    solid: CloudArrowDownIconSolid,
  },
  noSymbol: {
    outline: NoSymbolIcon,
    solid: NoSymbolIconSolid,
  },
  funnel: {
    outline: FunnelIcon,
    solid: FunnelIconSolid,
  },
  clock: {
    outline: ClockIcon,
    solid: ClockIconSolid,
  },
  cake: {
    outline: CakeIcon,
    solid: CakeIconSolid,
  },
  cloudArrowDown: {
    outline: CloudArrowDownIcon,
    solid: CloudArrowDownIconSolid,
  },
  checkCircle: {
    outline: CheckCircleIcon,
    solid: CheckCircleIconSolid,
  },
  arrowRight: {
    outline: ArrowRightIcon,
    solid: ArrowRightIconSolid,
  },
  chevronRight: {
    outline: ChevronRightIcon,
    solid: ChevronRightIconSolid,
  },
  lifebuoy: {
    outline: LifebuoyIcon,
    solid: LifebuoyIconSolid,
  },
  creditCard: {
    outline: CreditCardIcon,
    solid: CreditCardIconSolid,
  },
  shieldCheck: {
    outline: ShieldCheckIcon,
    solid: ShieldCheckIconSolid,
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
  chatBubbleBottomCenterText: {
    outline: ChatBubbleBottomCenterTextIcon,
    solid: ChatBubbleBottomCenterTextIconSolid,
  },
  arrowLeft: {
    outline: ArrowLeftIcon,
    solid: ArrowLeftIconSolid,
  },
  link: {
    outline: LinkIcon,
    solid: LinkIconSolid,
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
  tag: {
    outline: TagIcon,
    solid: TagIconSolid,
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
  chatBubbleLeft: {
    outline: ChatBubbleLeftIcon,
    solid: ChatBubbleLeftIconSolid,
  },
  chatBubbleLeftEllipsis: {
    outline: ChatBubbleLeftEllipsisIcon,
    solid: ChatBubbleLeftEllipsisIconSolid,
  },
  chatBubbleOvalLeftEllipsis: {
    outline: ChatBubbleOvalLeftEllipsisIcon,
    solid: ChatBubbleLeftEllipsisIconSolid,
  },
  contacts: {
    outline: UserGroupIcon,
    solid: UserGroupIconSolid,
  },
  scale: {
    outline: ScaleIcon,
    solid: ScaleIconSolid,
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
  envelope: {
    outline: EnvelopeIcon,
    solid: EnvelopeIconSolid,
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
  arrowUp: {
    outline: ArrowUpIcon,
    solid: ArrowUpIconSolid,
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
  phoneXMark: {
    outline: PhoneXMarkIcon,
    solid: PhoneXMarkIconSolid,
  },
  phoneArrowDownLeft: {
    outline: PhoneArrowDownLeftIcon,
    solid: PhoneArrowDownLeftIconSolid,
  },
  phoneArrowUpRight: {
    outline: PhoneArrowUpRightIcon,
    solid: PhoneArrowUpRightIconSolid,
  },
  paperAirplane: {
    outline: PaperAirplaneIcon,
    solid: PaperAirplaneIconSolid,
  },
  documentDuplicate: {
    outline: DocumentDuplicateIcon,
    solid: DocumentDuplicateIconSolid,
  },
  paperClip: {
    outline: PaperClipIcon,
    solid: PaperClipIconSolid,
  },
  pause: {
    outline: PauseIcon,
    solid: PauseIconSolid,
  },
  stop: {
    outline: StopIcon,
    solid: StopIconSolid,
  },
  identification: {
    outline: IdentificationIcon,
    solid: IdentificationIconSolid,
  },
  photo: {
    outline: PhotoIcon,
    solid: PhotoIconSolid,
  },
  clipboardDocumentCheck: {
    outline: ClipboardDocumentCheckIcon,
    solid: ClipboardDocumentCheckIconSolid,
  },
  bell: {
    outline: BellIcon,
    solid: BellIconSolid,
  },
  bellAlert: {
    outline: BellAlertIcon,
    solid: BellAlertIconSolid,
  },
  share: {
    outline: ShareIcon,
    solid: ShareIconSolid,
  },
  user: {
    outline: UserIcon,
    solid: UserIconSolid,
  },
  play: {
    outline: PlayIcon,
    solid: PlayIconSolid,
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
  magnifyingGlass: {
    outline: MagnifyingGlassIcon,
    solid: MagnifyingGlassIconSolid,
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
  mapPin: {
    outline: MapPinIcon,
    solid: MapPinIconSolid,
  },
  pencil: {
    outline: PencilIcon,
    solid: PencilIconSolid,
  },
  pencilSquare: {
    outline: PencilSquareIcon,
    solid: PencilSquareIconSolid,
  },
  briefcase: {
    outline: BriefcaseIcon,
    solid: BriefcaseIconSolid,
  },
  trash: {
    outline: TrashIcon,
    solid: TrashIconSolid,
  },
  fingerPrint: {
    outline: FingerPrintIcon,
    solid: FingerPrintIconSolid,
  },
}
