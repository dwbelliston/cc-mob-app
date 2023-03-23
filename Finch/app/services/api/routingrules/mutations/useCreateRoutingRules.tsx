import { API } from "@aws-amplify/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { IRoutingRule, IRoutingRuleCreate } from "../../../../models/RoutingRule"
import { APIEndpoints } from "../../config"
import { routingrulesKeys } from "../routingrules"

const makeApiRequest = (createIn: IRoutingRuleCreate[]) => {
  const postData = {
    body: createIn,
  }

  return API.post(APIEndpoints.authenticatedUsers, "/api/v1/routingrules/", postData)
}

const useCreateRoutingRules = () => {
  const queryClient = useQueryClient()

  return useMutation<IRoutingRule[], any, IRoutingRuleCreate[]>((data) => makeApiRequest(data), {
    // useErrorBoundary: true,
    retry: 0,
    onSettled: () => {
      queryClient.invalidateQueries(routingrulesKeys.all, {
        exact: false,
      })
    },
  })
}

export default useCreateRoutingRules
