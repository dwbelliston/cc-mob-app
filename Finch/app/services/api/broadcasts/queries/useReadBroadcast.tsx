import { API } from "@aws-amplify/api"
import { useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { IBroadcast } from "../../../../models/Broadcast"
import { APIEndpoints } from "../../config"
import { broadcastsKeys } from "../broadcasts"

const makeApiRequest = (broadcastId: string): Promise<IBroadcast> => {
  const qParams = {}

  return API.get(APIEndpoints.authenticatedCampaigns, `/api/v1/broadcasts/${broadcastId}`, qParams)
}

export const useReadBroadcast = (broadcastId) => {
  return useQuery<IBroadcast, AxiosError>(
    broadcastsKeys.detail(broadcastId),
    () => makeApiRequest(broadcastId),
    {
      retry: 2,
      enabled: !!broadcastId,
    },
  )
}
