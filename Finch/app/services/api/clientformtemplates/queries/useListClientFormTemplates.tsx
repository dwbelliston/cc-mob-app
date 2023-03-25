import { API } from "@aws-amplify/api"
import { useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { IPaginatedClientFormTemplates } from "../../../../models/ClientFormTemplate"
import { APIEndpoints } from "../../config"
import { clientformtemplatesKeys } from "../clientformtemplates"

const makeApiRequest = () => {
  const qParams = {
    queryStringParameters: {
      // TODO: We will solve for more than 100 later
      limit: 100,
    },
  }

  return API.get(APIEndpoints.authenticatedCampaigns, "/api/v1/clientformtemplates/", qParams)
}

const useListClientFormTemplates = () => {
  return useQuery<IPaginatedClientFormTemplates, AxiosError>(
    clientformtemplatesKeys.list(),
    () => {
      return makeApiRequest()
    },
    {
      select: (data: IPaginatedClientFormTemplates) => {
        data.records.sort((a, b) => {
          const aTitle = a.UseCase.toLowerCase()
          const bTitle = b.UseCase.toLowerCase()

          if (aTitle < bTitle) {
            return -1
          }
          if (aTitle > bTitle) {
            return 1
          }
          return 0
        })

        return data
      },
      keepPreviousData: true,
      cacheTime: 5000,
      retry: false,
    },
  )
}

export default useListClientFormTemplates
