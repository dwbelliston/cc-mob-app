import { API } from "@aws-amplify/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { IRoutingRule } from "../../../../models/RoutingRule"
import { APIEndpoints } from "../../config"
import { routingrulesKeys } from "../routingrules"

interface IProps {
  routingRuleId: string
  updateData: IRoutingRule
}

const makeApiRequest = ({ routingRuleId, updateData }: IProps): Promise<IRoutingRule> => {
  const reqData = {
    body: updateData,
  }
  return API.put(APIEndpoints.authenticatedUsers, `/api/v1/routingrules/${routingRuleId}`, reqData)
}

const useUpdateRoutingRule = () => {
  const queryClient = useQueryClient()

  return useMutation<IRoutingRule, AxiosError, IProps>(
    (props) => {
      return makeApiRequest(props)
    },
    {
      retry: 0,
      onSettled: () => {
        queryClient.invalidateQueries(routingrulesKeys.all)
      },
    },
  )
}

export default useUpdateRoutingRule
