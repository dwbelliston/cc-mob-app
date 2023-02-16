import { useQuery } from "@tanstack/react-query"
import { API } from "aws-amplify"
import { IUserProfile } from "../../../../models/UserProfile"

import { AxiosError } from "axios"
import { APIEndpoints, QueryKeys } from "../../config"

const makeApiRequest = (): Promise<IUserProfile> => {
  const qParams = {}

  return API.get(APIEndpoints.authenticatedUsers, "/api/v1/profile", qParams)
}

export default function useReadUserProfile() {
  return useQuery<IUserProfile, AxiosError>(QueryKeys.userprofile(), () => makeApiRequest(), {
    retry: 1,
    staleTime: 30000,
  })
}
