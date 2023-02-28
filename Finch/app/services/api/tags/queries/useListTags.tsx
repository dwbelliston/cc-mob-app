// List Tags

import { API } from "@aws-amplify/api"
import { useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { IPaginatedTags } from "../../../../models/Tag"
import { APIEndpoints } from "../../config"
import { tagsKeys } from "../tags"

const makeApiRequest = (): Promise<IPaginatedTags> => {
  const qParams = {
    queryStringParameters: {
      // we will solve for more than 100 later
      limit: 100,
    },
  }

  return API.get(APIEndpoints.authenticatedContacts, "/api/v1/tags/", qParams)
}

const useListTags = () => {
  return useQuery<IPaginatedTags, AxiosError, IPaginatedTags>(
    tagsKeys.list(),
    () => {
      return makeApiRequest()
    },
    {
      keepPreviousData: true,
      select: (data: IPaginatedTags) => {
        data.records.sort((a, b) => {
          const aVal = a.Title.toLowerCase()
          const bVal = b.Title.toLowerCase()

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

export default useListTags
