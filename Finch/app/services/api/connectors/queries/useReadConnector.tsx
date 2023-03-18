import { API } from "@aws-amplify/api"
import { useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { IConnector } from "../../../../models/Connector"

import { APIEndpoints } from "../../config"
import { connectorsKeys } from "../connectors"

const makeApiRequest = (connectorId, versions = true) => {
  const qParams = {
    queryStringParameters: {
      ...(versions && { versions: true }),
    },
  }

  return API.get(APIEndpoints.authenticatedUsers, `/api/v1/connectors/${connectorId}`, qParams)
}

export default function useReadConnector(connectorId) {
  return useQuery<IConnector, AxiosError>(
    connectorsKeys.detail(connectorId),
    () => makeApiRequest(connectorId),
    {
      enabled: !!connectorId,
    },
  )
}
