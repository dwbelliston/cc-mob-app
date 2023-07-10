import { CognitoUser } from "amazon-cognito-identity-js"

export interface IAuthLoginResponse {
  user?: CognitoUser
  status: "VERIFY" | "LOGIN"
}
