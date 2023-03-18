import { API } from "@aws-amplify/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { ISmsTemplate, ISmsTemplateUpdate } from "../../../../models/SmsTemplate"
import { APIEndpoints } from "../../config"
import { smsTemplatesKeys } from "../smstemplates"

interface IProps {
  smsTemplateId: string
  updateData: ISmsTemplateUpdate
}

const makeApiRequest = ({ smsTemplateId, updateData }: IProps): Promise<ISmsTemplate> => {
  const reqData = {
    body: updateData,
  }
  return API.put(APIEndpoints.authenticatedUsers, `/api/v1/smstemplates/${smsTemplateId}`, reqData)
}

const useUpdateSmsTemplate = () => {
  const queryClient = useQueryClient()

  return useMutation<ISmsTemplate, AxiosError, IProps>(
    (props) => {
      return makeApiRequest(props)
    },
    {
      retry: 0,

      onSettled: () => {
        queryClient.invalidateQueries(smsTemplatesKeys.all)
      },
    },
  )
}

export default useUpdateSmsTemplate
