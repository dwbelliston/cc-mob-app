import { Avatar, Box, Circle, IAvatarProps, ICircleProps, Spinner } from "native-base"
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
  sourceBadgeColor?: ColorType
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
    sourceBadgeColor,
  } = props

  const bgLoading = useColor("bg.main")

  return (
    <Circle
      mx="auto"
      display="inline"
      bg={innerRingColor}
      p={1}
      borderWidth={2}
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
              bg={avatarColor}
              _text={{
                color: "white",
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
          bottom={avatarProps.size === "md" ? -4 : 0}
          right={avatarProps.size === "md" ? -4 : 0}
          rounded="full"
          overflow="hidden"
          borderWidth={1}
          borderColor={sourceBadgeColor}
        >
          {sourceBadge}
        </Box>
      )}
    </Circle>
  )
}
