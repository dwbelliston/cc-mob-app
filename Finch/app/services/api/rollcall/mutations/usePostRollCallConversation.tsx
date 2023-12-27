import { API } from "@aws-amplify/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import {
  IRollCall,
  IRollCallConversationUpdate,
  IRollCallUpdate,
} from "../../../../models/RollCall"
import { APIEndpoints } from "../../config"
import { rollcallKeys } from "../rollcall"

export interface IProps {
  teammemberId: string
  updateData: IRollCallConversationUpdate
}

const makeApiRequest = (updateData: IRollCallConversationUpdate) => {
  const postData = {
    body: updateData,
  }

  return API.post(APIEndpoints.authenticatedUsers, "/api/v1/rollcall/conversation", postData)
}

const usePostRollCallConversation = () => {
  const queryClient = useQueryClient()

  return useMutation<IRollCallUpdate, AxiosError, IProps>(
    ({ teammemberId, updateData }: IProps) => {
      return makeApiRequest(updateData)
    },
    {
      retry: 0,
      onSettled: (updatedRollCall, err, conversationUpdate) => {
        // Get the current roll call
        const rollCallData: IRollCall | undefined = queryClient.getQueryData(
          rollcallKeys.online(),
          {
            exact: true,
          },
        )

        // Put the updated data on
        if (rollCallData) {
          const rollCallUpdate: IRollCall = {
            ...rollCallData,
            ...updatedRollCall,
          }

          queryClient.setQueryData(rollcallKeys.online(), rollCallUpdate)
        }
      },
    },
  )
}

export default usePostRollCallConversation
