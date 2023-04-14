import { API } from "@aws-amplify/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { IScheduledMessage } from "../../../../models/ScheduledMessage"
import { APIEndpoints } from "../../config"
import { scheduledMessagesKeys } from "../scheduledMessages"

const makeApiRequest = (recordId): Promise<IScheduledMessage> => {
  return API.del(APIEndpoints.authenticatedShed, `/api/v1/scheduled-messages/${recordId}`, {})
}

const useDeleteScheduledMessage = () => {
  const queryClient = useQueryClient()

  return useMutation<IScheduledMessage, AxiosError, string, any>(
    (recordId) => makeApiRequest(recordId),
    {
      retry: 0,
      onSettled: () => {
        queryClient.invalidateQueries(scheduledMessagesKeys.all)
      },
    },
  )
}

export default useDeleteScheduledMessage
