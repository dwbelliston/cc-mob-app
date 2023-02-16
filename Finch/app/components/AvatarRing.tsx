import { Avatar, Circle, IAvatarProps, ICircleProps } from "native-base"
import { ColorType } from "native-base/lib/typescript/components/types"
import { GenericAvatarIcon } from "./GenericAvatar"

interface IProps {
  initials?: string
  outerRingColor?: ColorType
  innerRingColor?: ColorType
  avatarColor?: ColorType
  ringProps?: ICircleProps
  avatarProps?: IAvatarProps
}

export const AvatarRing = (props: IProps) => {
  const {
    initials,
    outerRingColor = "transparent",
    innerRingColor = "transparent",
    avatarColor,
    ringProps,
    avatarProps,
  } = props

  return (
    <Circle bg={innerRingColor} p={1} borderWidth={2} borderColor={outerRingColor} {...ringProps}>
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
    </Circle>
  )
}
