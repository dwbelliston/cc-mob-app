import { API } from "@aws-amplify/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import {
  IComplianceMessage,
  IComplianceMessageEnabledUpdate,
  IComplianceMessageMessageUpdate,
} from "../../../../models/ComplianceMessage"
import { APIEndpoints } from "../../config"
import { complianceMessageKeys } from "../complianceMessage"

const makeApiRequest = (
  updateData: IComplianceMessageEnabledUpdate | IComplianceMessageMessageUpdate,
): Promise<IComplianceMessage> => {
  const reqData = {
    body: updateData,
  }
  return API.put(APIEndpoints.authenticatedOutbounds, `/api/v1/compliancemessage`, reqData)
}

const useUpdateComplianceMessage = () => {
  const queryClient = useQueryClient()

  return useMutation<
    IComplianceMessage,
    AxiosError,
    IComplianceMessageEnabledUpdate | IComplianceMessageMessageUpdate
  >((updateData) => makeApiRequest(updateData), {
    retry: 0,
    onMutate: async (updatedProfile) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries(complianceMessageKeys.read())

      // Snapshot the previous value
      const previousRecord = queryClient.getQueryData(complianceMessageKeys.read())

      // Optimistically update to the new value
      queryClient.setQueryData(complianceMessageKeys.read(), (old: any) => {
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
      queryClient.setQueryData(complianceMessageKeys.read(), context.previousRecord)
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(complianceMessageKeys.read())
    },
  })
}

export default useUpdateComplianceMessage
