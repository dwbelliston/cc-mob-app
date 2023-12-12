import { API } from "@aws-amplify/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ITeamMemberProfile, ITeamMemberProfileUpdate } from "../../../../models/TeamMemberProfile"
import { APIEndpoints } from "../../config"
import { teamMembersKeys } from "../teamMembers"

const makeApiRequest = (teamMemberId: string, updateData: ITeamMemberProfileUpdate) => {
  const payload = {
    body: updateData,
  }

  return API.put(APIEndpoints.authenticatedUsers, `/api/v1/team-members/${teamMemberId}`, payload)
}

const useUpdateTeamMember = () => {
  const queryClient = useQueryClient()
  return useMutation<
    ITeamMemberProfile,
    any,
    {
      teamMemberId: string
      updateData: ITeamMemberProfileUpdate
    },
    {
      previousRecord: ITeamMemberProfile | any
      teamMemberId: string
      updateData: ITeamMemberProfileUpdate
    }
  >(
    ({ teamMemberId, updateData }) => {
      return makeApiRequest(teamMemberId, updateData)
    },
    {
      retry: 0,
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.refetchQueries(teamMembersKeys.all)
      },
    },
  )
}

export default useUpdateTeamMember
