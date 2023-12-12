import { Box, Center, Spinner, Stack } from "native-base"

import React from "react"

import { Text } from "../../../../components"
import useListTeamMembers from "../../../../services/api/teammembers/queries/useListTeamMembers"
import { TeamMemberCard } from "./TeamMemberCard"

const TeamMembersList = () => {
  const { data: dataTeamMembers, isLoading: isLoadingData } = useListTeamMembers()

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
            {dataTeamMembers &&
              dataTeamMembers.records.map((teamMember) => {
                return (
                  <Box key={teamMember.TeamMemberId}>
                    <TeamMemberCard teamMember={teamMember}></TeamMemberCard>
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
