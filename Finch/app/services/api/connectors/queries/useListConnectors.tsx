import { API } from "@aws-amplify/api"
import { useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { IPaginatedConnectors } from "../../../../models/Connector"
import { APIEndpoints } from "../../config"
import { connectorsKeys } from "../connectors"

const makeApiRequest = () => {
  const qParams = {
    queryStringParameters: {
      // TODO: We will solve for more than 100 later
      limit: 100,
    },
  }

  return API.get(APIEndpoints.authenticatedUsers, "/api/v1/connectors/", qParams)
}

const useListConnectors = () => {
  return useQuery<IPaginatedConnectors, AxiosError>(
    connectorsKeys.list(),
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

export default useListConnectors
