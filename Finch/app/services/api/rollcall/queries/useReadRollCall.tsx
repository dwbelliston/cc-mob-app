import { API } from "@aws-amplify/api"
import { useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"

import { IRollCall } from "../../../../models/RollCall"
import { APIEndpoints } from "../../config"
import { rollcallKeys } from "../rollcall"

const INTERVAL_SECONDS = 8

const makeApiRequest = () => {
  const qParams = {}

  return API.get(APIEndpoints.authenticatedUsers, "/api/v1/rollcall/", qParams)
}

const useReadRollCall = () => {
  return useQuery<IRollCall, AxiosError>(rollcallKeys.online(), () => makeApiRequest(), {
    retry: 0,
    staleTime: 1000 * INTERVAL_SECONDS,
    refetchInterval: 1000 * INTERVAL_SECONDS,
  })
}

export default useReadRollCall
