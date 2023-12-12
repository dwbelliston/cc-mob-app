import { Avatar, Box, IAvatarProps } from "native-base"
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
}

interface IViewerAvatar {
  id: string
  isViewedLatest: boolean
  name: string
  avatarUrl?: string
  tooltip: string
}

const ConversationViewers = ({ viewers, latestTime, ...rest }: IProps) => {
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
    <Avatar.Group space={-1} max={5}>
      {viewerAvatars
        ?.sort((aa, bb) =>
          aa.isViewedLatest === bb.isViewedLatest ? 0 : aa.isViewedLatest ? -1 : 1,
        )
        .map((viewerAvatar) => {
          return (
            <Box key={viewerAvatar.id}>
              <Avatar
                source={{ uri: viewerAvatar.avatarUrl }}
                // borderWidth={1}
                // borderColor={
                //   viewerAvatar.isViewedLatest ? "primary.700" : "rose.700"
                // }
                opacity={viewerAvatar.isViewedLatest ? 1 : 0.35}
                {...rest}
              >
                {viewerAvatar.name}
              </Avatar>
            </Box>
          )
        })}
    </Avatar.Group>
  )
}

export default ConversationViewers
