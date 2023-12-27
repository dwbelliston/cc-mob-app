/**
 * Fallback avatar react component.
 */

import { Avatar, IAvatarProps } from "native-base"
import { useColor } from "../theme/useColor"
import { Icon } from "./Icon"

export const GenericAvatarIcon = (props: IAvatarProps) => {
  const bg = useColor("bg.higher")

  return (
    <Avatar bg={bg} {...props}>
      <Icon colorToken={"text.softer"} icon="user"></Icon>
    </Avatar>
  )
}
