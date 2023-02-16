import { Avatar, IAvatarProps, Pressable } from "native-base"
import { useUserInitials } from "../models/UserProfile"
import useReadUserProfile from "../services/api/userprofile/queries/useReadUserProfile"

import * as Haptics from "expo-haptics"

interface IProps extends IAvatarProps {
  onPress?: () => void
}
export const UserAvatar = (props: IProps) => {
  const { onPress, ...rest } = props

  const { data: userProfile } = useReadUserProfile()

  const userInitials = useUserInitials(userProfile)

  const handleOnPress = () => {
    if (onPress) {
      Haptics.selectionAsync()
      onPress()
    }
  }

  return (
    <Pressable onPress={handleOnPress} _pressed={{ opacity: 60 }}>
      <Avatar
        _light={{
          bg: "primary.700",
          _text: {
            color: "white",
          },
        }}
        _dark={{
          bg: "primary.200",
          _text: {
            color: "black",
          },
        }}
        size="md"
        source={{
          uri: userProfile?.BrandImageUrl,
        }}
        {...rest}
      >
        {userInitials}
      </Avatar>
    </Pressable>
  )
}
