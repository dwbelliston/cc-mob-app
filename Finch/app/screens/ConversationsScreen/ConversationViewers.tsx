import { Avatar, Box, IAvatarProps, useColorModeValue } from "native-base"
import React from "react"
import { IConversation } from "../../models/Conversation"
import { ITeamMember } from "../../models/TeamMember"
import useListTeamMembers from "../../services/api/teammembers/queries/useListTeamMembers"
import { getInitials } from "../../utils/getInitials"
import {
  runCompareIsFirstBeforeSecond,
  runFormatTimeFromNowSpecial,
} from "../../utils/useFormatDate"

interface IProps extends IAvatarProps {
  viewers: IConversation["Viewers"]
  latestTime: IConversation["UpdatedTime"]
  maxViewers?: number
}

interface IViewerAvatar {
  id: string
  isViewedLatest: boolean
  name: string
  avatarUrl?: string
  tooltip: string
}

interface IConversationViewerAvatarProps {
  opacity: any
  avatarUrl?: string
  avatarName?: string
}

const ConversationViewerAvatar = ({
  opacity,
  avatarUrl,
  avatarName,
  ...rest
}: IConversationViewerAvatarProps) => {
  const colorAvatar = useColorModeValue("gray.500", "gray.500")

  // Display the avatar... do a hard return to make sure it refreshes... native base bug? idk
  if (avatarUrl) {
    return (
      <Avatar source={{ uri: avatarUrl }} opacity={opacity} {...rest}>
        {avatarName}
      </Avatar>
    )
  }
  return (
    <Avatar color={colorAvatar} opacity={opacity} {...rest}>
      {avatarName}
    </Avatar>
  )
}
const ConversationViewers = ({ viewers, latestTime, maxViewers = 5, ...rest }: IProps) => {
  const [viewerAvatars, setViewerAvatars] = React.useState<IViewerAvatar[]>([])

  const { data: dataTeammembers } = useListTeamMembers()

  const getTeamMemberAvatar = (
    teammemberId: string,
    lastViewedTimestamp: string,
  ): IViewerAvatar => {
    const timeFromNow = runFormatTimeFromNowSpecial(lastViewedTimestamp)

    let isViewedLatest = true

    if (latestTime) {
      isViewedLatest = runCompareIsFirstBeforeSecond(latestTime, lastViewedTimestamp)
    }

    let lastViewedNote = `Last Viewed ${timeFromNow}`

    if (isViewedLatest) {
      lastViewedNote = `Up to date - Last Viewed ${timeFromNow}`
    }

    // Get defaults
    let avatarUrlUpdate: string | undefined = ""
    let avatarNameUpdate = ""

    if (teammemberId && dataTeammembers) {
      // If we have a member and data for lookups
      let foundMember: ITeamMember | undefined

      foundMember = dataTeammembers?.records.find(
        (teamMember) => teamMember.CognitoUserId === teammemberId,
      )

      if (foundMember) {
        avatarUrlUpdate = foundMember.BrandImageUrl
        avatarNameUpdate = `${foundMember.FirstName} ${foundMember.LastName}`
        avatarNameUpdate = getInitials(avatarNameUpdate)
      }
    }

    return {
      id: teammemberId,
      isViewedLatest: isViewedLatest,
      name: avatarNameUpdate,
      avatarUrl: avatarUrlUpdate,
      tooltip: lastViewedNote,
    }
  }

  React.useEffect(() => {
    const viewerAvatarsUpdate: IViewerAvatar[] = []

    if (viewers) {
      Object.entries(viewers).forEach((entry) => {
        const [teammemberId, lastViewed] = entry

        const newAvatar = getTeamMemberAvatar(teammemberId, lastViewed)

        viewerAvatarsUpdate.push(newAvatar)
      })
    }

    setViewerAvatars(viewerAvatarsUpdate)
  }, [viewers, dataTeammembers])

  return (
    <Avatar.Group space={-1} max={maxViewers}>
      {viewerAvatars
        ?.sort((aa, bb) =>
          aa.isViewedLatest === bb.isViewedLatest ? 0 : aa.isViewedLatest ? -1 : 1,
        )
        .map((viewerAvatar) => {
          return (
            <Box key={viewerAvatar.id} borderWidth={0}>
              <ConversationViewerAvatar
                opacity={viewerAvatar.isViewedLatest ? 100 : 30}
                avatarUrl={viewerAvatar.avatarUrl}
                avatarName={viewerAvatar.name}
                {...rest}
              ></ConversationViewerAvatar>
            </Box>
          )
        })}
    </Avatar.Group>
  )
}

export default ConversationViewers
