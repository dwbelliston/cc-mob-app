import { API } from "@aws-amplify/api"
import { useQuery } from "@tanstack/react-query"

import { AxiosError } from "axios"
import { APIEndpoints } from "../../config"
import { conversationKeys } from "../conversations"

const makeApiRequest = (): Promise<string> => {
  const qParams = {}

  return API.get(APIEndpoints.authenticatedOutbounds, "/api/v1/conversations/count-unread", qParams)
}

const useGetCountUnreadConversations = () => {
  return useQuery<string, AxiosError>(
    conversationKeys.getUnreadCount(),
    (_props) => {
      return makeApiRequest()
    },
    {
      refetchInterval: 15000,
      retry: 1,
    },
  )
}

export default useGetCountUnreadConversations
