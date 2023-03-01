import { API } from "@aws-amplify/api"
import { useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { IConversation } from "../../../../models/Conversation"
import { APIEndpoints } from "../../config"
import { conversationKeys } from "../conversations"

const makeApiRequest = (conversationId: string): Promise<IConversation> => {
  const qParams = {}

  return API.get(
    APIEndpoints.authenticatedOutbounds,
    `/api/v1/conversations/${conversationId}`,
    qParams,
  )
}

export const useReadConversation = (conversationId) => {
  return useQuery<IConversation, AxiosError>(
    conversationKeys.detail(conversationId),
    () => makeApiRequest(conversationId),
    {
      retry: 2,
      enabled: !!conversationId,
    },
  )
}
