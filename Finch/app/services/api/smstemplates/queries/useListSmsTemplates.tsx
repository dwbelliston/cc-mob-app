import { API } from "@aws-amplify/api"
import { useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { IPaginatedSmsTemplates } from "../../../../models/SmsTemplate"
import { APIEndpoints } from "../../config"
import { smsTemplatesKeys } from "../smstemplates"

const makeApiRequest = () => {
  const qParams = {
    queryStringParameters: {
      // TODO: We will solve for more than 100 later
      limit: 100,
    },
  }

  return API.get(APIEndpoints.authenticatedUsers, "/api/v1/smstemplates/", qParams)
}

const useListSmsTemplates = () => {
  return useQuery<IPaginatedSmsTemplates, AxiosError>(
    smsTemplatesKeys.list(),
    () => {
      return makeApiRequest()
    },
    {
      select: (data: IPaginatedSmsTemplates) => {
        data.records.sort((a, b) => {
          const aTitle = a.Title.toLowerCase()
          const bTitle = b.Title.toLowerCase()

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

export default useListSmsTemplates
