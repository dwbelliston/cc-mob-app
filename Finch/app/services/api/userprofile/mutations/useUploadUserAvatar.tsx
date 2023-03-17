import { useMutation } from "@tanstack/react-query"
import appConfig from "../../../../../app-config"
import { APIEndpoints } from "../../config"

const makeApiRequest = async (formData: FormData): Promise<Response> => {
  const authUsersApi = appConfig.API.endpoints.find(
    (end) => end.name === APIEndpoints.authenticatedUsers,
  )

  const baseUrl = authUsersApi.endpoint
  const authHeader = await authUsersApi.custom_header()

  const postData: RequestInit = {
    body: formData,
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
      ...authHeader,
    },
    method: "POST",
  }

  return fetch(`${baseUrl}/api/v1/profile/uploadbranding`, postData)
}

const useUploadUserAvatar = () => {
  return useMutation<Response, any, FormData>((formData) => makeApiRequest(formData), {
    retry: 0,
  })
}

export default useUploadUserAvatar
