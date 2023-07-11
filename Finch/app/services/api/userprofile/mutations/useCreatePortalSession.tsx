import { API } from "@aws-amplify/api"
import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"
import appConfig from "../../../../../app-config"
import { IBillingPortalConfiguration } from "../../../../models/Billing"
import { APIEndpoints } from "../../config"

const makeApiRequest = (configuration: IBillingPortalConfiguration): Promise<string> => {
  if (!configuration.ReturnUrl) {
    configuration.ReturnUrl = appConfig.Stripe.billingPortalReturnUrl
  }

  const postData = {
    body: configuration,
  }

  return API.post(
    APIEndpoints.authenticatedUsers,
    "/api/v1/billing/create-portal-session",
    postData,
  )
}

export const useCreatePortalSession = () => {
  return useMutation<string, AxiosError, IBillingPortalConfiguration>(
    (configuration: IBillingPortalConfiguration) => makeApiRequest(configuration),
    {
      // useErrorBoundary: true,
      retry: 1,
    },
  )
}
