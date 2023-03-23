import { API } from "@aws-amplify/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { IContact, IContactUpdate } from "../../../../models/Contact"
import { APIEndpoints } from "../../config"
import { contactsKeys } from "../contacts"

interface IProps {
  contactId: string
  updateData: IContactUpdate
}

const makeApiRequest = ({ contactId, updateData }: IProps): Promise<IContact> => {
  const reqData = {
    body: updateData,
  }
  return API.put(APIEndpoints.authenticatedContacts, `/api/v1/contacts/${contactId}`, reqData)
}

const useUpdateContact = () => {
  const queryClient = useQueryClient()

  return useMutation<IContact, AxiosError, IProps>(
    (props) => {
      return makeApiRequest(props)
    },
    {
      retry: 0,

      onMutate: async (updates) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries(contactsKeys.details())

        const detailKey = contactsKeys.detail(updates.contactId, false)

        // Snapshot the previous value
        const previousRecord = queryClient.getQueryData(detailKey)

        // Optimistically update to the new value
        queryClient.setQueryData(detailKey, (old: any) => {
          return {
            ...old,
            ...updates.updateData,
          }
        })

        // Return a context object with the snapshotted value
        return { previousRecord }
      },
      // If the mutation fails, use the context returned from onMutate to roll back
      onError: (err, updates, context: any) => {
        const detailKey = contactsKeys.detail(updates.contactId, false)

        queryClient.setQueryData(detailKey, context.previousRecord)
      },
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries(contactsKeys.all)
      },
    },
  )
}

export default useUpdateContact
