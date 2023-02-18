import { API } from "@aws-amplify/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { IConversation, IConversationUpdate } from "../../../../models/Conversation"
import { APIEndpoints, QueryKeys } from "../../config"

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
      retry: 1,

      onMutate: async (updatedConversation) => {
        // Cancel any outgoing refetches
        // (so they don't overwrite our optimistic update)
        // await queryClient.cancelQueries({ queryKey: QueryKeys.conversations() })

        // Snapshot the previous value
        const previousConversations = queryClient.getQueryData(QueryKeys.conversations())

        console.log("previousConversations")
        console.log(previousConversations)

        // Optimistically update to the new value
        // queryClient.setQueryData(["todos"], (old) => [...old, newTodo])

        // Return a context object with the snapshotted value
        return { previousConversations }
      },
      // If the mutation fails,
      // use the context returned from onMutate to roll back
      // onError: (err, newTodo, context) => {
      //   queryClient.setQueryData(['todos'], context.previousTodos)
      // },
      // // Always refetch after error or success:
      // onSettled: () => {
      //   queryClient.invalidateQueries({ queryKey: ['todos'] })
      // },
      onSettled: () => {
        queryClient.invalidateQueries(QueryKeys.conversations(), {
          exact: false,
        })
      },
    },
  )
}

export default useUpdateConversation
