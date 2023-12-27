import { Avatar, Box, Fade, IAvatarProps } from "native-base"
import React from "react"
import { IRollCallCreateViewerStatus } from "../../models/RollCall"
import { ITeamMember } from "../../models/TeamMember"
import useReadRollCall from "../../services/api/rollcall/queries/useReadRollCall"
import useListTeamMembers from "../../services/api/teammembers/queries/useListTeamMembers"

interface IProps extends IAvatarProps {
  conversationId: string
}

interface IViewerAvatar {
  id: string
  isInConversation: boolean
  name: string
  avatarUrl?: string
}

const TIME_OFFSET_SECONDS = 35

const ConversationRealtimeViewers = ({ conversationId, ...rest }: IProps) => {
  const [viewerAvatars, setViewerAvatars] = React.useState<IViewerAvatar[]>([])

  const { data: dataRollCall } = useReadRollCall()
  const { data: dataTeammembers } = useListTeamMembers()

  const getTeamMemberAvatar = (
    currentTimeSecs: number,
    teammemberId: string,
    conversationConfig: IRollCallCreateViewerStatus,
  ): IViewerAvatar | null => {
    const lastViewedInt = parseInt(conversationConfig.ViewedTime)

    const isInConversation = currentTimeSecs - lastViewedInt <= TIME_OFFSET_SECONDS

    if (!isInConversation) {
      return null
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
      }
    }

    return {
      id: teammemberId,
      isInConversation: isInConversation,
      name: avatarNameUpdate,
      avatarUrl: avatarUrlUpdate,
    }
  }

  React.useEffect(() => {
    const viewerAvatarsUpdate: IViewerAvatar[] = []
    const currentTimeSecs = Math.floor(new Date().getTime() / 1000)

    const rollCallViewers = dataRollCall?.ViewingConversation

    if (conversationId && rollCallViewers) {
      Object.entries(rollCallViewers).forEach((entry) => {
        const [teammemberId, conversationConfig] = entry

        // Is the teammember looking at this conversation?
        if (conversationConfig.ConversationId === conversationId) {
          const newAvatar = getTeamMemberAvatar(currentTimeSecs, teammemberId, conversationConfig)
          if (newAvatar) {
            viewerAvatarsUpdate.push(newAvatar)
          }
        }
      })
    }

    setViewerAvatars(viewerAvatarsUpdate)
  }, [dataRollCall, conversationId, dataTeammembers])

  return (
    <Avatar.Group space={-1} max={5}>
      {viewerAvatars.map((viewerAvatar) => {
        return (
          <Box key={viewerAvatar.id} borderWidth={0}>
            <Fade in={true}>
              <Avatar
                source={{
                  uri: viewerAvatar.avatarUrl,
                }}
                {...rest}
              >
                {viewerAvatar.name}
              </Avatar>
            </Fade>
          </Box>
        )
      })}
    </Avatar.Group>
  )
}

export default ConversationRealtimeViewers
