import { API } from "@aws-amplify/api"
import { useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { IPaginatedScheduledMessages } from "../../../../models/ScheduledMessage"
import { APIEndpoints } from "../../config"
import { scheduledMessagesKeys } from "../scheduledMessages"

const makeApiRequest = (number) => {
  const qParams = {
    queryStringParameters: {
      // TODO: We will solve for more than 100 later
      limit: 100,
    },
  }

  return API.get(
    APIEndpoints.authenticatedShed,
    `/api/v1/scheduled-messages/number/${number}`,
    qParams,
  )
}

const useListNumberScheduledMessages = (number) => {
  return useQuery<IPaginatedScheduledMessages, AxiosError>(
    scheduledMessagesKeys.number(number),
    () => {
      return makeApiRequest(number)
    },
    {
      enabled: !!number,
      keepPreviousData: true,
      cacheTime: 5000,
      retry: false,
    },
  )
}

export default useListNumberScheduledMessages
