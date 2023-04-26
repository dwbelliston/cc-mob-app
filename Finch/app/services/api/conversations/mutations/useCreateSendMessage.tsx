import { API } from "@aws-amplify/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { IMessage, IMessageCreate } from "../../../../models/Message"
import { APIEndpoints } from "../../config"
import { conversationKeys } from "../conversations"

const makeApiRequest = (props: IMessageCreate) => {
  const postData = {
    body: props,
  }

  return API.post(APIEndpoints.authenticatedOutbounds, `/api/v1/messages/send`, postData)
}

const useCreateSendMessage = () => {
  const queryClient = useQueryClient()

  return useMutation<IMessage, AxiosError, IMessageCreate>(
    (props) => {
      return makeApiRequest(props)
    },
    {
      retry: 0,
      // onMutate: async (newMessage) => {
      //   const uNumber = newMessage.UserNumber
      //   const cNumber = newMessage.ContactNumber
      //   const conversationId = getConversationId(uNumber, cNumber)

      //   const qKey = conversationKeys.stream(conversationId, null)

      //   // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      //   await queryClient.cancelQueries(qKey)

      //   // Snapshot the previous value
      //   const streamMessage = queryClient.getQueryData<any>(qKey)

      //   console.log("previousRecord", streamMessage)

      //   if (streamMessage?.pages) {
      //     const currentPageMessages: any[] = streamMessage.pages[0].records
      //     currentPageMessages.unshift(newMessage)
      //     console.log("currentPageMessages", currentPageMessages[0])
      //   }

      //   // Optimistically update to the new value
      //   queryClient.setQueryData(qKey, (oldData: any) => {
      //     return {
      //       ...oldData,
      //       ...streamMessage,
      //     }
      //   })

      //   // Return a context object with the snapshotted value
      //   return { previousRecord: streamMessage }
      // },
      onSettled: () => {
        queryClient.invalidateQueries(conversationKeys.streams(), {
          exact: false,
        })
      },
    },
  )
}

export default useCreateSendMessage
