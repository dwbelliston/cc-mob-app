import { API } from "@aws-amplify/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { IConnector, ICreateConnectorDevice } from "../../../../models/Connector"
import { APIEndpoints } from "../../config"
import { connectorsKeys } from "../connectors"

const makeApiRequest = (createIn: ICreateConnectorDevice) => {
  const postData = {
    body: createIn,
  }

  return API.post(APIEndpoints.authenticatedUsers, "/api/v1/connectors/device", postData)
}

const useCreateDeviceConnector = () => {
  const queryClient = useQueryClient()

  return useMutation<IConnector, AxiosError, ICreateConnectorDevice>(
    (data) => makeApiRequest(data),
    {
      // useErrorBoundary: true,
      retry: 0,
      onSettled: () => {
        queryClient.invalidateQueries(connectorsKeys.all, {
          exact: false,
        })
      },
    },
  )
}

export default useCreateDeviceConnector
