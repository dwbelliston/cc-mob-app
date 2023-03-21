import { API } from "@aws-amplify/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { IContact, IContactCreate } from "../../../../models/Contact"
import { APIEndpoints } from "../../config"
import { contactsKeys } from "../contacts"

const makeApiRequest = (createIn: IContactCreate[]) => {
  const postData = {
    body: createIn,
  }

  return API.post(APIEndpoints.authenticatedContacts, "/api/v1/contacts/", postData)
}

const useCreateContacts = () => {
  const queryClient = useQueryClient()

  return useMutation<IContact[], any, IContactCreate[]>((data) => makeApiRequest(data), {
    // useErrorBoundary: true,
    retry: 0,
    onSettled: () => {
      queryClient.invalidateQueries(contactsKeys.all, {
        exact: false,
      })
    },
  })
}

export default useCreateContacts
