import { ITextProps } from "native-base"
import React from "react"
import { Text } from "../../components"
import { IRollCallCreateViewerStatus } from "../../models/RollCall"
import { ITeamMember } from "../../models/TeamMember"
import { runGetTeammemberUserId } from "../../models/UserProfile"
import useReadRollCall from "../../services/api/rollcall/queries/useReadRollCall"
import useListTeamMembers from "../../services/api/teammembers/queries/useListTeamMembers"
import useReadUserProfile from "../../services/api/userprofile/queries/useReadUserProfile"

interface IProps extends ITextProps {
  conversationId?: string | null
}
const TIME_OFFSET_SECONDS = 35

const ConversationRealtimeTyping = ({ conversationId, ...rest }: IProps) => {
  const [typingPlacement, setTypingPlacement] = React.useState<string>("")
  const { data: userProfile } = useReadUserProfile()

  const userTeamMemberId = runGetTeammemberUserId(userProfile)

  const { data: dataRollCall } = useReadRollCall()
  const { data: dataTeammembers } = useListTeamMembers()

  const getTeamMemberName = (
    currentTimeSecs: number,
    teammemberId: string,
    conversationConfig: IRollCallCreateViewerStatus,
  ): string => {
    let memberName = ""

    const lastViewedInt = parseInt(conversationConfig.ViewedTime)

    const isInConversation = currentTimeSecs - lastViewedInt <= TIME_OFFSET_SECONDS

    if (!isInConversation) {
      return memberName
    }

    if (teammemberId && dataTeammembers) {
      // If we have a member and data for lookups
      let foundMember: ITeamMember | undefined

      foundMember = dataTeammembers?.records.find(
        (teamMember) => teamMember.CognitoUserId === teammemberId,
      )

      if (foundMember) {
        memberName = `${foundMember.FirstName}`
      }
    }

    return memberName
  }

  React.useEffect(() => {
    let typingPlacementUpdate = ""

    const currentTimeSecs = Math.floor(new Date().getTime() / 1000)

    const names: string[] = []

    const rollCallViewers = dataRollCall?.ViewingConversation

    if (conversationId && rollCallViewers) {
      Object.entries(rollCallViewers)
        .filter(([memberId, conConfig]) => memberId !== userTeamMemberId && conConfig.IsTyping)
        .forEach((entry) => {
          const [teammemberId, conversationConfig] = entry

          // Is the teammember looking at this conversation?
          if (conversationConfig.ConversationId === conversationId) {
            const memberName = getTeamMemberName(currentTimeSecs, teammemberId, conversationConfig)
            if (memberName) {
              names.push(memberName)
            }
          }
        })
    }

    if (names?.length > 0) {
      typingPlacementUpdate = `${names.join(", ")} is typing...`
    }

    setTypingPlacement(typingPlacementUpdate)
  }, [dataRollCall, conversationId, dataTeammembers])

  if (!typingPlacement) {
    return null
  }

  return (
    <Text colorToken={"text.soft"} {...rest}>
      {typingPlacement}
    </Text>
  )
}

export default ConversationRealtimeTyping
