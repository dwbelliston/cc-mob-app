import { API } from "aws-amplify";
import { useMutation, useQueryClient } from "react-query";
import { IRoutingRule } from "../../../../routes/settings/routing/models/RoutingRule";
import { QueryKeys } from "../../QueryKeys";

const makeApiRequest = (routingRuleId): Promise<IRoutingRule> => {
  return API.del("users", `/api/v1/routingrules/${routingRuleId}`, {});
};

const useDeleteRoutingRule = () => {
  const queryClient = useQueryClient();

  const {
    data,
    error,
    isError,
    isIdle,
    isLoading,
    isPaused,
    isSuccess,
    mutate,
    mutateAsync,
    reset,
    status,
  } = useMutation<IRoutingRule, any, { routingRuleId: string }, any>(
    ({ routingRuleId }) => makeApiRequest(routingRuleId),
    {
      retry: 0,
      onSettled: () => {
        queryClient.invalidateQueries(QueryKeys.routingRules, { exact: false });
      },
    }
  );

  return {
    data,
    error,
    isError,
    isIdle,
    isLoading,
    isPaused,
    isSuccess,
    mutate,
    mutateAsync,
    reset,
    status,
  };
};

export default useDeleteRoutingRule;
