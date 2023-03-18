import { API } from "@aws-amplify/api"
import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"
import appConfig from "../../../../../app-config"
import { APIEndpoints } from "../../config"

const makeApiRequest = (): Promise<string> => {
  const postData = {
    body: appConfig.Stripe.billingPortalReturnUrl,
  }

  return API.post(
    APIEndpoints.authenticatedUsers,
    "/api/v1/billing/create-portal-session",
    postData,
  )
}

export const useCreatePortalSession = () => {
  return useMutation<string, AxiosError>(() => makeApiRequest(), {
    // useErrorBoundary: true,
    retry: 2,
  })
}
