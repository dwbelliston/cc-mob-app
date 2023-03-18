import { API } from "@aws-amplify/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { ISmsTemplate } from "../../../../models/SmsTemplate"
import { APIEndpoints } from "../../config"
import { smsTemplatesKeys } from "../smstemplates"

const makeApiRequest = (smsTemplateId): Promise<ISmsTemplate> => {
  return API.del(APIEndpoints.authenticatedUsers, `/api/v1/smstemplates/${smsTemplateId}`, {})
}

const useDeleteSmsTemplate = () => {
  const queryClient = useQueryClient()

  return useMutation<ISmsTemplate, AxiosError, string, any>(
    (smsTemplateId) => makeApiRequest(smsTemplateId),
    {
      retry: 0,
      onSettled: () => {
        queryClient.invalidateQueries(smsTemplatesKeys.all)
      },
    },
  )
}

export default useDeleteSmsTemplate
