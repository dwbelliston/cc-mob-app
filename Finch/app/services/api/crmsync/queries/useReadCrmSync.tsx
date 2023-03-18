import { API } from "@aws-amplify/api"
import { useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { ICrmSync } from "../../../../models/CrmSync"

import { APIEndpoints } from "../../config"
import { crmSyncKeys } from "../crmSync"

const makeApiRequest = (userId, versions = true) => {
  const qParams = {
    queryStringParameters: {
      ...(versions && { versions: true }),
    },
  }

  return API.get(APIEndpoints.authenticatedUsers, `/api/v1/crmsync/${userId}`, qParams)
}

export default function useReadCrmSync(userId) {
  return useQuery<ICrmSync, AxiosError>(crmSyncKeys.detail(userId), () => makeApiRequest(userId), {
    enabled: !!userId,
  })
}
