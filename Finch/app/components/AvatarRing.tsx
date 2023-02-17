import { Avatar, Circle, IAvatarProps, ICircleProps, Spinner } from "native-base"
import { ColorType } from "native-base/lib/typescript/components/types"
import { useColor } from "../theme/useColor"
import { GenericAvatarIcon } from "./GenericAvatar"

interface IProps {
  initials?: string
  outerRingColor?: ColorType
  innerRingColor?: ColorType
  avatarColor?: ColorType
  ringProps?: ICircleProps
  avatarProps?: IAvatarProps
  isLoading?: boolean
}

export const AvatarRing = (props: IProps) => {
  const {
    initials,
    outerRingColor = "transparent",
    innerRingColor = "transparent",
    avatarColor,
    ringProps,
    avatarProps,
    isLoading,
  } = props

  const bgLoading = useColor("bg.main")

  return (
    <Circle bg={innerRingColor} p={1} borderWidth={2} borderColor={outerRingColor} {...ringProps}>
      {isLoading ? (
        <Avatar size="md" bg={bgLoading} {...avatarProps}>
          <Spinner></Spinner>
        </Avatar>
      ) : (
        <>
          {initials ? (
            <Avatar
              bg={avatarColor}
              _text={{ color: "white", fontSize: "xs" }}
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
    </Circle>
  )
}
