// The avatar is the admin user, by default
// but if a sender member id matches a team memebr, that that is displayed
// the sender member id will be its cognito user id

import { Avatar, IAvatarProps } from "native-base"
import React from "react"
import { ITeamMember } from "../../models/TeamMember"
import {
  runGetDefaultAdminBrandImageUrl,
  runGetDefaultAdminUserName,
} from "../../models/UserProfile"
import useListTeamMembers from "../../services/api/teammembers/queries/useListTeamMembers"
import useReadUserProfile from "../../services/api/userprofile/queries/useReadUserProfile"

interface IProps extends IAvatarProps {
  senderMemberId?: string
  senderName?: string
}

export const TeamMemberAvatar = ({ senderMemberId, senderName, ...rest }: IProps) => {
  const [avatarUrl, setAvatarUrl] = React.useState<string>()
  const [avatarName, setAvatarName] = React.useState<string>()

  const { data: userProfile } = useReadUserProfile()
  const { data: dataTeammembers } = useListTeamMembers()

  React.useEffect(() => {
    // Get defaults
    let avatarUrlUpdate = runGetDefaultAdminBrandImageUrl(userProfile)
    let avatarNameUpdate = senderName || runGetDefaultAdminUserName(userProfile)

    if (senderMemberId && dataTeammembers) {
      // If we have a member and data for lookups
      let foundMember: ITeamMember | undefined

      foundMember = dataTeammembers?.records.find(
        (teamMember) => teamMember.CognitoUserId === senderMemberId,
      )

      if (foundMember) {
        avatarUrlUpdate = foundMember.BrandImageUrl
        avatarNameUpdate = `${foundMember.FirstName} ${foundMember.LastName}`
      }
    }

    setAvatarUrl(avatarUrlUpdate)
    setAvatarName(avatarNameUpdate)
  }, [userProfile, dataTeammembers, senderName, senderMemberId])

  return (
    <Avatar source={{ uri: avatarUrl }} size="md" {...rest}>
      {avatarName}
    </Avatar>
  )
}
