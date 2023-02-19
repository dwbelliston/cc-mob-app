import { IAvatarProps, Pressable } from "native-base"
import { useUserInitials } from "../models/UserProfile"
import useReadUserProfile from "../services/api/userprofile/queries/useReadUserProfile"

import { useIsFetching } from "@tanstack/react-query"
import * as Haptics from "expo-haptics"
import { AvatarRing } from "./AvatarRing"

interface IProps extends IAvatarProps {
  onPress?: () => void
}
export const UserAvatar = (props: IProps) => {
  const { onPress, ...rest } = props

  const isQFetching = useIsFetching()

  const { data: userProfile, isLoading: isLoadingProfile } = useReadUserProfile()

  const userInitials = useUserInitials(userProfile)

  const handleOnPress = () => {
    if (onPress) {
      Haptics.selectionAsync()
      onPress()
    }
  }

  const isLoading = isQFetching > 0 || isLoadingProfile

  return (
    <Pressable onPress={handleOnPress} _pressed={{ opacity: 60 }}>
      <AvatarRing
        initials={userInitials}
        avatarProps={{
          _light: {
            bg: !isLoading ? "primary.700" : null,
            _text: {
              color: "white",
            },
          },
          _dark: {
            bg: !isLoading ? "primary.200" : null,
            _text: {
              color: "black",
            },
          },
          source: {
            uri: !isLoading ? userProfile?.BrandImageUrl : null,
          },
          ...rest,
        }}
        isLoading={isLoading}
      ></AvatarRing>
    </Pressable>
  )
}
