import { API } from "@aws-amplify/api"
import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { APIEndpoints } from "../../config"

const makeApiRequest = () => {
  const postData = {}

  return API.post(APIEndpoints.authenticatedUsers, "/api/v1/rollcall/online", postData)
}

const usePostRollCallOnline = () => {
  return useMutation<string, AxiosError>(
    () => {
      return makeApiRequest()
    },
    {
      retry: 0,
    },
  )
}

export default usePostRollCallOnline
