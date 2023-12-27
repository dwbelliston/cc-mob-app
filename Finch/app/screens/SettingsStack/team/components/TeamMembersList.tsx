import { Box, Center, Spinner, Stack } from "native-base"

import React from "react"

import { Text } from "../../../../components"
import { ITeamMember } from "../../../../models/TeamMember"
import useReadRollCall from "../../../../services/api/rollcall/queries/useReadRollCall"
import useListTeamMembers from "../../../../services/api/teammembers/queries/useListTeamMembers"
import { ITeamMemberOnlineProps, TeamMemberOnlineCard } from "./TeamMemberOnlineCard"

const TIME_ONLINE_OFFSET_SECONDS = 30

const TeamMembersList = () => {
  const [teamMembers, setTeamMembers] = React.useState<ITeamMemberOnlineProps[]>([])

  const { data: dataTeamMembers, isLoading: isLoadingData } = useListTeamMembers()
  const { data: dataRollCall } = useReadRollCall()

  const getTeamMemberAvatar = (
    teamMember: ITeamMember,
    currentTimeSecs: number,
  ): ITeamMemberOnlineProps => {
    const onlineTeam = dataRollCall?.Online

    let teamMemberLastOnline = ""

    const cognitoUserIdLookup = teamMember.CognitoUserId

    if (onlineTeam && onlineTeam[cognitoUserIdLookup]) {
      teamMemberLastOnline = onlineTeam[cognitoUserIdLookup]
    }

    const lastOnlineInt = parseInt(teamMemberLastOnline)

    const isOnline = currentTimeSecs - lastOnlineInt <= TIME_ONLINE_OFFSET_SECONDS

    return {
      ...teamMember,
      IsOnline: isOnline,
    }
  }

  React.useEffect(() => {
    const teamMembersUpdate: ITeamMemberOnlineProps[] = []
    const currentTimeSecs = Math.floor(new Date().getTime() / 1000)

    dataTeamMembers?.records.forEach((teamMember) => {
      const newAvatar = getTeamMemberAvatar(teamMember, currentTimeSecs)
      teamMembersUpdate.push(newAvatar)
    })

    setTeamMembers(teamMembersUpdate)
  }, [dataRollCall, dataTeamMembers])

  return (
    <>
      <Box>
        <Stack space={6}>
          {isLoadingData && (
            <Center py={4}>
              <Spinner></Spinner>
            </Center>
          )}

          {(!dataTeamMembers || !dataTeamMembers.records.length) && !isLoadingData && (
            <Box>
              <Text colorToken="text.softer" tx="team.noTeamMembers"></Text>
            </Box>
          )}

          <Stack space={6}>
            {teamMembers &&
              teamMembers.map((viewerAvatar) => {
                return (
                  <Box key={viewerAvatar.TeamMemberId}>
                    <TeamMemberOnlineCard viewerAvatar={viewerAvatar}></TeamMemberOnlineCard>
                  </Box>
                )
              })}
          </Stack>
        </Stack>
      </Box>
    </>
  )
}

export default TeamMembersList
