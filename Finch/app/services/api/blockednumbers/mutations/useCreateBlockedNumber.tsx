import { API } from "@aws-amplify/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { IBlockedNumber, IBlockedNumberCreate } from "../../../../models/BlockedNumber"
import { APIEndpoints, QueryKeys } from "../../config"

const makeApiRequest = (createIn: IBlockedNumberCreate) => {
  const postData = {
    body: createIn,
  }

  return API.post(APIEndpoints.authenticatedOutbounds, "/api/v1/blockednumbers/", postData)
}

const useCreateBlockedNumber = () => {
  const queryClient = useQueryClient()

  return useMutation<IBlockedNumber, any, IBlockedNumberCreate>(
    (dropsForm) => makeApiRequest(dropsForm),
    {
      // useErrorBoundary: true,
      retry: 0,
      onSettled: () => {
        queryClient.invalidateQueries(QueryKeys.blockednumbers(), {
          exact: false,
        })
      },
    },
  )
}

export default useCreateBlockedNumber
