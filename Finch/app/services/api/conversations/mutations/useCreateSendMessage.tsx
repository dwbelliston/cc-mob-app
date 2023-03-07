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
      onSettled: () => {
        queryClient.invalidateQueries(conversationKeys.streams(), {
          exact: false,
        })
      },
    },
  )
}

export default useCreateSendMessage
