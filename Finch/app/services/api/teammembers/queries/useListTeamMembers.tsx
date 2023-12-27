import { API } from "@aws-amplify/api"
import { useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { IPaginatedTeamMembers } from "../../../../models/TeamMember"
import { APIEndpoints } from "../../config"
import { teamMembersKeys } from "../teamMembers"

const makeApiRequest = (): Promise<IPaginatedTeamMembers> => {
  const qParams = {
    queryStringParameters: {
      // we will solve for more than 100 later
      limit: 100,
    },
  }

  return API.get(APIEndpoints.authenticatedUsers, "/api/v1/team-members/", qParams)
}

const useListTeamMembers = () => {
  return useQuery<IPaginatedTeamMembers, AxiosError, IPaginatedTeamMembers>(
    teamMembersKeys.list(),
    () => {
      return makeApiRequest()
    },
    {
      keepPreviousData: true,
      select: (data: IPaginatedTeamMembers) => {
        data.records.sort((a, b) => {
          const aVal = a.Email.toLowerCase()
          const bVal = b.Email.toLowerCase()

          if (aVal < bVal) {
            return -1
          }
          if (aVal > bVal) {
            return 1
          }
          return 0
        })

        return data
      },
    },
  )
}

export default useListTeamMembers
