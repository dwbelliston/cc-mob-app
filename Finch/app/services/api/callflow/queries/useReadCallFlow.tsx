import { API } from "@aws-amplify/api"
import { useQuery } from "@tanstack/react-query"

import { AxiosError } from "axios"
import { ICallFlow } from "../../../../models/CallFlow"
import { APIEndpoints } from "../../config"
import { callflowKeys } from "../callflow"

const makeApiRequest = (): Promise<ICallFlow> => {
  const qParams = {}

  return API.get(APIEndpoints.authenticatedOutbounds, "/api/v1/call-flow", qParams)
}

export default function useReadCallFlow() {
  return useQuery<ICallFlow, AxiosError>(callflowKeys.read(), () => makeApiRequest(), {
    retry: 1,
    staleTime: 30000,
  })
}
