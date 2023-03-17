import { API } from "@aws-amplify/api"
import { useQuery } from "@tanstack/react-query"
import { IUserProfile } from "../../../../models/UserProfile"

import { AxiosError } from "axios"
import { APIEndpoints } from "../../config"
import { userprofileKeys } from "../userprofile"

const makeApiRequest = (): Promise<IUserProfile> => {
  const qParams = {}

  return API.get(APIEndpoints.authenticatedUsers, "/api/v1/profile", qParams)
}

export default function useReadUserProfile() {
  return useQuery<IUserProfile, AxiosError>(userprofileKeys.myProfile(), () => makeApiRequest(), {
    retry: 1,
    staleTime: 30000,
  })
}
