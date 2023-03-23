import { API } from "@aws-amplify/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { IConversation, IConversationUpdate } from "../../../../models/Conversation"
import { APIEndpoints } from "../../config"
import { conversationKeys } from "../conversations"

interface IPutProps {
  conversationId: string
  updates: IConversationUpdate
}

const makeApiRequest = ({ conversationId, updates }: IPutProps) => {
  const payload = {
    body: updates,
  }

  return API.put(
    APIEndpoints.authenticatedOutbounds,
    `/api/v1/conversations/${conversationId}`,
    payload,
  )
}

const useUpdateConversation = () => {
  const queryClient = useQueryClient()

  return useMutation<IConversation, AxiosError, IPutProps>(
    (props) => {
      return makeApiRequest(props)
    },
    {
      retry: 0,
      // onSuccess: (resConversation, updatedConversation) => {
      //   queryClient.setQueriesData<InfiniteData<IPaginatedConversations>>(
      //     conversationKeys.lists(),
      //     (previous) => {
      //       return {
      //         ...previous,
      //         pages: previous.pages.map((page) => {
      //           return {
      //             ...page,
      //             records: page.records.map((record) => {
      //               if (record.ConversationId === updatedConversation.conversationId) {
      //                 return {
      //                   ...record,
      //                   ...updatedConversation.updates,
      //                 }
      //               }

      //               return record
      //             }),
      //           }
      //         }),
      //       }
      //     },
      //   )
      // },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: conversationKeys.lists() })
        queryClient.invalidateQueries({ queryKey: conversationKeys.getUnreadCount() })
        queryClient.refetchQueries({ queryKey: conversationKeys.getUnreadCount(), exact: true })
      },
    },
  )
}

export default useUpdateConversation
