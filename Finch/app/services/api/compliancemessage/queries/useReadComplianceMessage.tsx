import { API } from "@aws-amplify/api"
import { useQuery } from "@tanstack/react-query"

import { AxiosError } from "axios"
import { IComplianceMessage } from "../../../../models/ComplianceMessage"
import { APIEndpoints } from "../../config"
import { complianceMessageKeys } from "../complianceMessage"

const makeApiRequest = (): Promise<IComplianceMessage> => {
  const qParams = {}

  return API.get(APIEndpoints.authenticatedOutbounds, "/api/v1/compliancemessage", qParams)
}

export default function useReadComplianceMessage() {
  return useQuery<IComplianceMessage, AxiosError>(
    complianceMessageKeys.read(),
    () => makeApiRequest(),
    {
      retry: 1,
      staleTime: 30000,
    },
  )
}
