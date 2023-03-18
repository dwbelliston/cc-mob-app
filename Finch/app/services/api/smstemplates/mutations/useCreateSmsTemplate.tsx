import { API } from "@aws-amplify/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ISmsTemplate, ISmsTemplateCreate } from "../../../../models/SmsTemplate"
import { APIEndpoints } from "../../config"
import { smsTemplatesKeys } from "../smstemplates"

const makeApiRequest = (templateData: ISmsTemplateCreate) => {
  const postData = {
    body: templateData,
  }

  return API.post(APIEndpoints.authenticatedUsers, "/api/v1/smstemplates/", postData)
}

const useCreateSmsTemplate = () => {
  const queryClient = useQueryClient()

  return useMutation<ISmsTemplate, any, ISmsTemplateCreate>(
    (templateData) => makeApiRequest(templateData),
    {
      retry: 0,
      onSettled: () => {
        queryClient.invalidateQueries(smsTemplatesKeys.all)
      },
    },
  )
}

export default useCreateSmsTemplate
