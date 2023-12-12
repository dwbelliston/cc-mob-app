import { useMutation } from "@tanstack/react-query"
import appConfig from "../../../../../app-config"
import { APIEndpoints } from "../../config"

interface IProps {
  teamMemberId: string
  file: FormData
}

const makeApiRequest = async (props: IProps): Promise<Response> => {
  const authUsersApi = appConfig.API.endpoints.find(
    (end) => end.name === APIEndpoints.authenticatedUsers,
  )

  const baseUrl = authUsersApi.endpoint
  const authHeader = await authUsersApi.custom_header()

  const postData: RequestInit = {
    body: props.file,
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
      ...authHeader,
    },
    method: "POST",
  }

  return fetch(`${baseUrl}/api/v1/team-members/${props.teamMemberId}/uploadbranding`, postData)
}

const useUploadTeamMemberMedia = () => {
  return useMutation<Response, any, IProps>((props) => makeApiRequest(props), {
    retry: 0,
  })
}

export default useUploadTeamMemberMedia
