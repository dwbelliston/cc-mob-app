import { API } from "@aws-amplify/api"
import { useQuery } from "@tanstack/react-query"
import { ITeamMemberProfile } from "../../../../models/TeamMemberProfile"
import { APIEndpoints } from "../../config"
import { teamMembersKeys } from "../teamMembers"

const makeApiRequest = (): Promise<ITeamMemberProfile> => {
  const qParams = {}

  return API.get(APIEndpoints.authenticatedUsers, "/api/v1/team-members/me", qParams)
}

export default function useReadTeamMemberProfile() {
  return useQuery(teamMembersKeys.me(), () => makeApiRequest(), {
    retry: 1,
    staleTime: 30000,
  })
}
