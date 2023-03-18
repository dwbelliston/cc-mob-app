import { API } from "@aws-amplify/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { ICallFlow, ICallForwardingForm } from "../../../../models/CallFlow"
import { APIEndpoints } from "../../config"
import { callflowKeys } from "../callflow"

const makeApiRequest = (updateData: ICallForwardingForm): Promise<ICallFlow> => {
  const reqData = {
    body: updateData,
  }
  return API.put(APIEndpoints.authenticatedOutbounds, `/api/v1/call-flow`, reqData)
}

const useUpdateCallFlow = () => {
  const queryClient = useQueryClient()

  return useMutation<ICallFlow, AxiosError, ICallForwardingForm>(
    (updateData) => makeApiRequest(updateData),
    {
      retry: 0,
      onMutate: async (updatedProfile) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries(callflowKeys.read())

        // Snapshot the previous value
        const previousRecord = queryClient.getQueryData(callflowKeys.read())

        // Optimistically update to the new value
        queryClient.setQueryData(callflowKeys.read(), (old: any) => {
          return {
            ...old,
            ...updatedProfile,
          }
        })

        // Return a context object with the snapshotted value
        return { previousRecord }
      },
      // If the mutation fails, use the context returned from onMutate to roll back
      onError: (err, _newPost, context: any) => {
        queryClient.setQueryData(callflowKeys.read(), context.previousRecord)
      },
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries(callflowKeys.read())
      },
    },
  )
}

export default useUpdateCallFlow
