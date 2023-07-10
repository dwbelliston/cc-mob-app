import {
  Avatar,
  Box,
  Circle,
  IAvatarProps,
  ICircleProps,
  Spinner,
  useColorModeValue,
} from "native-base"
import { ColorType } from "native-base/lib/typescript/components/types"
import { useColor } from "../theme/useColor"
import { GenericAvatarIcon } from "./GenericAvatar"

export interface IAvatarRingProps {
  initials?: string
  outerRingColor?: ColorType
  innerRingColor?: ColorType
  avatarColor?: ColorType
  ringProps?: ICircleProps
  avatarProps?: IAvatarProps
  isLoading?: boolean
  sourceBadge?: React.ReactElement
  avatarUrl?: string
}

export const AvatarRing = (props: IAvatarRingProps) => {
  const {
    initials,
    outerRingColor = "transparent",
    innerRingColor = "transparent",
    avatarColor,
    ringProps,
    avatarProps,
    isLoading,
    sourceBadge,
    avatarUrl,
  } = props

  const bgLoading = useColor("bg.main")

  const _bgAvatar = useColorModeValue("gray.100", "gray.800")
  const _colorAvatar = useColorModeValue("gray.500", "gray.500")
  const _borderAvatar = useColorModeValue("gray.200", "gray.700")
  const bgAvatar = avatarColor || _bgAvatar
  const colorAvatar = avatarColor ? "white" : _colorAvatar
  const borderAvatar = avatarColor || _borderAvatar

  return (
    <Circle
      mx="auto"
      // THis crashed on android
      // display="inline"
      bg={innerRingColor}
      p={0.5}
      borderWidth={1}
      borderColor={outerRingColor}
      {...ringProps}
    >
      {isLoading ? (
        <Avatar size="md" bg={bgLoading} {...avatarProps}>
          <Spinner></Spinner>
        </Avatar>
      ) : (
        <>
          {initials ? (
            <Avatar
              borderWidth={1}
              borderColor={borderAvatar}
              bg={bgAvatar}
              source={{
                uri: avatarUrl,
              }}
              _text={{
                color: colorAvatar,
                allowFontScaling: false,
              }}
              size="md"
              {...avatarProps}
            >
              {initials}
            </Avatar>
          ) : (
            <GenericAvatarIcon size="md" {...avatarProps} />
          )}
        </>
      )}
      {sourceBadge && (
        <Box
          position="absolute"
          bottom={avatarProps.size === "md" ? -4 : -2}
          right={avatarProps.size === "md" ? -4 : -2}
          rounded="full"
          overflow="hidden"
        >
          {sourceBadge}
        </Box>
      )}
    </Circle>
  )
}
