import { Auth } from "@aws-amplify/auth"
import { Instance, SnapshotOut, types } from "mobx-state-tree"
import * as Sentry from "sentry-expo"
import { IAuthLoginResponse } from "./Login"
import { withSetPropAction } from "./helpers/withSetPropAction"

const AuthChallenge = types.model({
  username: types.string,
  password: types.string
})

export const AuthenticationStoreModel = types
  .model("AuthenticationStore")
  .props({
    userId: types.maybe(types.string),
    username: types.maybe(types.string),
    loginError: types.maybe(types.string),
    registerError: types.maybe(types.string),
    validateError: types.maybe(types.string),
    resetPasswordError: types.maybe(types.string),
    resetPasswordConfirmError: types.maybe(types.string),
    challengeUser: types.maybe(AuthChallenge),
    challengeName: types.maybe(types.string),
    isRememberDevice: types.maybe(types.boolean),
  })
  .views((store) => ({
    get isAuthenticated() {
      // Auth.currentSession().then(res => console.log(res.getAccessToken().getJwtToken()))
      return !!store.userId
    },
    // getCurrentUser() {
    //   // try {
    //   //   data = await Auth.currentSession();
    //   Auth.currentUserInfo().then((val) => {
    //     console.log("in getCurrentUser", val);
    //     store.username = val.username;
    //     //   user = { ...user.attributes, username: user.username };
    //     return val;
    //   });
    // },
    get getCurrentUser() {
      return !!store.username
    },
  }))
  .actions(withSetPropAction)
  .actions((store) => ({
    setLoginError(loginError: string) {
      store.loginError = loginError
    },
    setIsRememberDevice(isRememberDevice: boolean) {
      store.isRememberDevice = isRememberDevice
    },
    setChallengeUser(challengeUser: any) {
      store.challengeUser = challengeUser
    },
    setChallengeName(challengeName: string | undefined) {
      store.challengeName = challengeName
    },
    async rememberDevice() {

      try {
        await Auth.rememberDevice()
      } catch (error: any) {
        Sentry.Native.captureException(error)
      }
    },
    async forgetDevice() {

      try {
        await Auth.forgetDevice()
      } catch (error: any) {
        Sentry.Native.captureException(error)
      }
    },
  }))
  .actions((store) => ({
    async login(
      username: string,
      password: string,
      isRememberDevice: boolean,
    ): Promise<IAuthLoginResponse | undefined> {
      let authRes: IAuthLoginResponse | undefined = undefined

      try {
        const user = await Auth.signIn(username, password)

        if (user.challengeName === "SMS_MFA" || user.challengeName === "SOFTWARE_TOKEN_MFA") {
          store.setChallengeUser({username, password})
          store.setIsRememberDevice(isRememberDevice)
          store.setChallengeName(user.challengeName)
          authRes = {
            status: "VERIFY",
          }
        } else {
          authRes = {
            status: "LOGIN",
          }

          if (isRememberDevice) {
            await store.rememberDevice()
          } else {
            await store.forgetDevice()
          }

          store.setProp("userId", user.username)
          store.setProp("loginError", undefined)
        }
      } catch (error: any) {
        let errorMessage = "Failed login"

        if (error.code === "UserNotFoundException") {
          errorMessage = "Email not found"
        } else if (error.code === "InvalidParameterException") {
          errorMessage = "Please use an email as username"
        } else if (error.code === "NotAuthorizedException") {
          errorMessage = "Please try password again"
        } else if (error.code === "UserNotConfirmedException") {
          errorMessage = "Please confirm your email"
        } else if (!username) {
          errorMessage = "Please enter your username"
        }

        store.setProp("loginError", errorMessage)
      }

      return authRes
    },
    async confirmLogin(code: string, mfaType: "SOFTWARE_TOKEN_MFA" | "SMS_MFA") {
      try {
        const challengeUserCreds = store.challengeUser

        const userSesh = await Auth.signIn(challengeUserCreds.username, challengeUserCreds.password)

        const activeUser = await Auth.confirmSignIn(
          userSesh, // Return object from Auth.signIn()
          code, // Confirmation code
          mfaType, // MFA Type e.g. SMS_MFA, SOFTWARE_TOKEN_MFA
        )

        if (store.isRememberDevice) {
          await store.rememberDevice()
        } else {
          await store.forgetDevice()
        }

        store.setProp("isRememberDevice", undefined)
        store.setChallengeUser(undefined)
        store.setChallengeName(undefined)
        store.setProp("loginError", undefined)
        store.setProp("userId", activeUser.username)
      } catch (error: any) {
        console.error(error)
        Sentry.Native.captureException(error)

        let errorMessage = "Failed login"

        if (error.code === "CodeMismatchException") {
          errorMessage = "Incorrect code, try again"
        }

        store.setProp("loginError", errorMessage)
      }
    },
    async resetPassword(username: string) {
      try {
        await Auth.forgotPassword(username)
      } catch (error: any) {
        let errorMessage = "Reset failed"
        store.setProp("resetPasswordError", errorMessage)
        throw error
      }
    },
    async resetErrors() {
      store.setProp("loginError", "")
      store.setProp("registerError", "")
      store.setProp("validateError", "")
      store.setProp("resetPasswordError", "")
      store.setProp("resetPasswordConfirmError", "")
    },
    async resetPasswordConfirm(email: string, code: string, password: string) {
      try {
        await Auth.forgotPasswordSubmit(email, code, password)
        store.setProp("resetPasswordConfirmError", "")
      } catch (error: any) {
        let errorMessage =
          "Oh no! Looks like we can't reset the password right now. Please try again later."

        if (error.code === "CodeMismatchException") {
          errorMessage = "Code is not correct, please request a new one."
        }

        store.setProp("resetPasswordConfirmError", errorMessage)
        throw error
      }
    },
    async resetRegister() {
      store.setProp("registerError", undefined)
    },
    async logout() {
      const user = await Auth.signOut()

      store.setProp("userId", undefined)
      store.setProp("registerError", undefined)
      store.setProp("loginError", undefined)
    },
    async register(username: string, password: string) {
      store.setProp("registerError", undefined)

      try {
        const user = await Auth.signUp(username, password)

        store.setProp("registerError", undefined)
      } catch (error: any) {
        let errorMessage = "Failed to create"
        console.log("error.code", error.code)

        if (error?.message) {
          errorMessage = error.message
        }

        if (error.code === "UsernameExistsException") {
          errorMessage = "Email already in use. Please login."
        }

        store.setProp("registerError", errorMessage)
        throw error
      }
    },
    async validateEmail(username: string, code: string) {
      try {
        const user = await Auth.confirmSignUp(username, code)
        console.log("user", user)
        store.setProp("validateError", undefined)
      } catch (error: any) {
        let errorMessage = "Failed to create"
        console.log("error.code", error.code)

        if (error?.message) {
          errorMessage = error.message
        }

        // if (error.code === "UsernameExistsException") {
        //   errorMessage = "Email already in use. Use login instead.";
        // }

        store.setProp("validateError", errorMessage)
        throw error
      }
    },
  }))

export interface AuthenticationStore extends Instance<typeof AuthenticationStoreModel> {}
export interface AuthenticationStoreSnapshot extends SnapshotOut<typeof AuthenticationStoreModel> {}
