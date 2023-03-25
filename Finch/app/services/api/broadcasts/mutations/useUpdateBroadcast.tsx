import { API } from "@aws-amplify/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { IBroadcast, IBroadcastUpdate } from "../../../../models/Broadcast"
import { APIEndpoints } from "../../config"
import { broadcastsKeys } from "../broadcasts"

interface IPutProps {
  broadcastId: string
  updates: IBroadcastUpdate
}

const makeApiRequest = ({ broadcastId, updates }: IPutProps) => {
  const payload = {
    body: updates,
  }

  return API.put(APIEndpoints.authenticatedCampaigns, `/api/v1/broadcasts/${broadcastId}`, payload)
}

const useUpdateBroadcast = () => {
  const queryClient = useQueryClient()

  return useMutation<IBroadcast, AxiosError, IPutProps>(
    (props) => {
      return makeApiRequest(props)
    },
    {
      retry: 0,
      onSettled: (data) => {
        queryClient.invalidateQueries({ queryKey: broadcastsKeys.lists() })
        queryClient.invalidateQueries({ queryKey: broadcastsKeys.detail(data?.BroadcastId) })
      },
    },
  )
}

export default useUpdateBroadcast
