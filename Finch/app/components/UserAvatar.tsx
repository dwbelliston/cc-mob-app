import { IAvatarProps, Pressable } from "native-base"
import { useUserInitials } from "../models/UserProfile"
import useReadUserProfile from "../services/api/userprofile/queries/useReadUserProfile"

import { useIsFetching } from "@tanstack/react-query"
import * as Haptics from "expo-haptics"
import { AvatarRing } from "./AvatarRing"

interface IProps extends IAvatarProps {
  isShowLoading?: boolean
  onPress?: () => void
}
export const UserAvatar = (props: IProps) => {
  const { onPress, isShowLoading = false, ...rest } = props

  const isQFetching = useIsFetching()

  const { data: userProfile, isLoading: isLoadingProfile } = useReadUserProfile()

  const userInitials = useUserInitials(userProfile)

  const handleOnPress = () => {
    if (onPress) {
      Haptics.selectionAsync()
      onPress()
    }
  }

  const isLoading = isShowLoading && (isQFetching > 0 || isLoadingProfile)

  return (
    <Pressable onPress={handleOnPress} _pressed={{ opacity: 60 }}>
      <AvatarRing
        initials={userInitials}
        avatarProps={{
          _light: {
            bg: !isLoading ? "gray.50" : null,
            _text: {
              color: "gray.500",
            },
          },
          _dark: {
            bg: !isLoading ? "gray.700" : null,
            _text: {
              color: "gray.200",
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
