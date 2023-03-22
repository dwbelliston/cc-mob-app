import { API } from "@aws-amplify/api"
import { useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { IContact } from "../../../../models/Contact"

import { APIEndpoints } from "../../config"
import { contactsKeys } from "../contacts"

const makeApiRequest = (contactId, versions = true) => {
  const qParams = {
    queryStringParameters: {
      ...(versions && { versions: true }),
    },
  }

  return API.get(APIEndpoints.authenticatedContacts, `/api/v1/contacts/${contactId}`, qParams)
}

export default function useReadContact(contactId, isListVersions = true) {
  return useQuery<IContact, AxiosError>(
    contactsKeys.detail(contactId, isListVersions),
    () => makeApiRequest(contactId, isListVersions),
    {
      enabled: !!contactId,
    },
  )
}
