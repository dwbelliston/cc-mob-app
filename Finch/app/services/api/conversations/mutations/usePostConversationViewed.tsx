import { API } from "@aws-amplify/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { IConversation, IConversationViewers } from "../../../../models/Conversation"
import { APIEndpoints } from "../../config"
import { conversationKeys } from "../conversations"

interface IPutProps {
  conversationId?: string
}

const makeApiRequest = ({ conversationId }: IPutProps) => {
  const postData = {}

  return API.post(
    APIEndpoints.authenticatedOutbounds,
    `/api/v1/conversations/${conversationId}/viewed`,
    postData,
  )
}

const usePostConversationViewed = () => {
  const queryClient = useQueryClient()

  return useMutation<IConversationViewers, any, IPutProps>(
    (props) => {
      return makeApiRequest(props)
    },
    {
      retry: 0,
      onSettled: (newViewers, _a, { conversationId }) => {
        const conversationData: IConversation | undefined = queryClient.getQueryData(
          conversationKeys.detail(conversationId),
          {
            exact: true,
          },
        )

        if (conversationData && newViewers?.Viewers) {
          const conversationUpdate = {
            ...conversationData,
            Viewers: newViewers.Viewers,
          }

          queryClient.setQueryData(conversationKeys.detail(conversationId), conversationUpdate)
        }
      },
    },
  )
}

export default usePostConversationViewed
