import { API } from "@aws-amplify/api"
import { useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { IPaginatedRoutingRules } from "../../../../models/RoutingRule"
import { APIEndpoints } from "../../config"
import { routingrulesKeys } from "../routingrules"

const makeApiRequest = () => {
  const qParams = {
    queryStringParameters: {
      // TODO: We will solve for more than 100 later
      limit: 100,
    },
  }

  return API.get(APIEndpoints.authenticatedUsers, "/api/v1/routingrules/", qParams)
}

const useListRoutingRules = () => {
  return useQuery<IPaginatedRoutingRules, AxiosError>(
    routingrulesKeys.list(),
    () => {
      return makeApiRequest()
    },
    {
      keepPreviousData: true,
      cacheTime: 5000,
      retry: false,
    },
  )
}

export default useListRoutingRules
