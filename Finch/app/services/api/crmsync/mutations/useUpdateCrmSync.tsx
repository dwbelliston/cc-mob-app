import { API } from "@aws-amplify/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { ICrmSync, ICrmSyncUpdate } from "../../../../models/CrmSync"
import { APIEndpoints } from "../../config"
import { crmSyncKeys } from "../crmSync"

interface IProps {
  userId: string
  updateData: ICrmSyncUpdate
}

const makeApiRequest = ({ userId, updateData }: IProps): Promise<ICrmSync> => {
  const reqData = {
    body: updateData,
  }
  return API.put(APIEndpoints.authenticatedUsers, `/api/v1/crmsync/${userId}`, reqData)
}

const useUpdateCrmSync = () => {
  const queryClient = useQueryClient()

  return useMutation<ICrmSync, AxiosError, IProps>(
    (props) => {
      return makeApiRequest(props)
    },
    {
      retry: 0,
      onSettled: () => {
        queryClient.invalidateQueries(crmSyncKeys.all)
      },
    },
  )
}

export default useUpdateCrmSync
