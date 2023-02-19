import { useMutation, useQueryClient } from "@tanstack/react-query"
import { API } from "aws-amplify"
import { AxiosError } from "axios"
import { ConversationStatusEnum, IConversation } from "../../../../models/Conversation"
import { APIEndpoints, conversationKeys } from "../../config"

interface IProps {
  conversationId?: string
  status: ConversationStatusEnum
}

const makeApiRequest = ({ conversationId, status }: IProps) => {
  const postData = {
    body: { Status: status },
  }

  return API.post(
    APIEndpoints.authenticatedOutbounds,
    `/api/v1/conversations/${conversationId}/status`,
    postData,
  )
}

const usePostConversationStatus = () => {
  const queryClient = useQueryClient()

  return useMutation<IConversation, AxiosError, IProps>(
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
      //                   Status: updatedConversation.status,
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
      },
    },
  )
}

export default usePostConversationStatus
