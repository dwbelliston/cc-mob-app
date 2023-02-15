import { Amplify } from "@aws-amplify/core"

import appConfig from "../../app-config"

Amplify.configure(appConfig)

export const AuthProvider = (props: any) => {
  return props.children
}
