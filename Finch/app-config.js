import Auth from "@aws-amplify/auth"

import {
  REACT_APP_API_CAMPAIGNS_HOST, REACT_APP_API_CONTACTS_HOST, REACT_APP_API_OUTBOUNDS_HOST,
  REACT_APP_API_USERS_HOST, REACT_APP_CLIENT_HOST, REACT_APP_ENV, REACT_APP_STRIPE_RETURN_URL, REACT_APP_USERPOOL_CLIENT,
  REACT_APP_USERPOOL_ID,
  REACT_APP_USERPOOL_REGION,
  REACT_APP_WEB_HOST
} from "@env"
import { APIEndpoints } from "./app/services/api/config"

const appConfig = {
  version: "0.0.12 (Beta)",
  env: REACT_APP_ENV,
  isDev: REACT_APP_ENV === "DEV",
  Auth: {
    region: REACT_APP_USERPOOL_REGION,
    userPoolId: REACT_APP_USERPOOL_ID,
    userPoolWebClientId: REACT_APP_USERPOOL_CLIENT,
    authenticationFlowType: "USER_SRP_AUTH",
  },
  Web: {
    hostname: REACT_APP_WEB_HOST,
    clientHost: REACT_APP_CLIENT_HOST
  },
  Stripe: {
    billingPortalReturnUrl: REACT_APP_STRIPE_RETURN_URL,
  },
  API: {
    endpoints: [
      {
        name: APIEndpoints.authenticatedUsers,
        // endpoint: "http://0.0.0.0:8001",
        endpoint: REACT_APP_API_USERS_HOST,
        custom_header: async () => {
          return {
            Authorization: `Bearer ${(await Auth.currentSession()).getAccessToken().getJwtToken()}`,
          }
        },
      },
      {
        name: APIEndpoints.authenticatedOutbounds,
        // endpoint: "http://0.0.0.0:8001",
        endpoint: REACT_APP_API_OUTBOUNDS_HOST,
        custom_header: async () => {
          return {
            Authorization: `Bearer ${(await Auth.currentSession()).getAccessToken().getJwtToken()}`,
          }
        },
      },
      {
        name: APIEndpoints.authenticatedContacts,
        // endpoint: "http://0.0.0.0:8001",
        endpoint: REACT_APP_API_CONTACTS_HOST,
        custom_header: async () => {
          return {
            Authorization: `Bearer ${(await Auth.currentSession()).getAccessToken().getJwtToken()}`,
          }
        },
      },
      {
        name: APIEndpoints.authenticatedCampaigns,
        // endpoint: "http://0.0.0.0:8001",
        endpoint: REACT_APP_API_CAMPAIGNS_HOST,
        custom_header: async () => {
          return {
            Authorization: `Bearer ${(await Auth.currentSession()).getAccessToken().getJwtToken()}`,
          }
        },
      },
      {
        name: APIEndpoints.publicUsers,
        // endpoint: "http://0.0.0.0:8001",
        endpoint: REACT_APP_API_USERS_HOST,
      },
    ],
  },
}

export default appConfig
