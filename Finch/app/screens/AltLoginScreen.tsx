import { yupResolver } from "@hookform/resolvers/yup"
import * as LocalAuthentication from "expo-local-authentication"
import { observer } from "mobx-react-lite"
import { Stack } from "native-base"
import React, { FC } from "react"
import { useForm } from "react-hook-form"
import * as yup from "yup"
import { Button, Icon, Screen, Text } from "../components"
import { Butter } from "../components/Butter"
import { FormControl } from "../components/FormControl"
import { FormSingleCheckbox } from "../components/FormSingleCheckbox"
import { useStores } from "../models"
import { AppStackScreenProps } from "../navigators"
import { spacing } from "../theme"
import {
  secureStorageDelete,
  secureStorageRead,
  secureStorageSave,
} from "../utils/storage/securestorage"
import { useCustomToast } from "../utils/useCustomToast"

// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../models"

const welcomeLogo = require("../../assets/images/img-concentric.png")

const STORAGE_KEY_REMEMBERLOGIN = "v1.rememberloginAlt"
const STORAGE_KEY_USERNAME = "v1.usernameAlt"
const STORAGE_KEY_PASSWORD = "v1.passwordAlt"

type IFormInputs = {
  email: string
  password: string
  rememberDevice: boolean
}

const schema = yup.object({
  email: yup.string().required("Required"),
  password: yup.string().required("Required"),
  rememberDevice: yup.boolean(),
})

export const AltLoginScreen: FC<AppStackScreenProps<"Login">> = observer(function AltLoginScreen(
  _props,
) {
  const { route, navigation } = _props

  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [attemptsCount, setAttemptsCount] = React.useState(0)
  const [isBiometricSupported, setIsBiometricSupported] = React.useState<boolean>(true)

  const {
    authenticationStore: { setLoginError, loginError, login },
  } = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()
  const toast = useCustomToast()

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      rememberDevice: true,
    },
  })

  const onSubmit = async (data: IFormInputs) => {
    setLoginError("")

    await secureStorageSave(STORAGE_KEY_REMEMBERLOGIN, data.rememberDevice ? "true" : "false")

    // If remember device
    if (data.rememberDevice) {
      await secureStorageSave(STORAGE_KEY_USERNAME, data.email)
      await secureStorageSave(STORAGE_KEY_PASSWORD, data.password)
    } else {
      await secureStorageDelete(STORAGE_KEY_USERNAME)
      await secureStorageDelete(STORAGE_KEY_PASSWORD)
    }

    setIsSubmitting(true)
    setAttemptsCount(attemptsCount + 1)
    try {
      await login(data.email, data.password)
    } catch (e) {}
    setIsSubmitting(false)
  }

  const handleOnBack = () => {
    setLoginError("")
    navigation.navigate("Login")
  }

  const handleFillInWithBio = async () => {
    try {
      const biometricAuth = await LocalAuthentication.authenticateAsync({
        promptMessage: "Use saved alt login",
        disableDeviceFallback: true,
        cancelLabel: "Cancel",
      })

      if (biometricAuth.success) {
        const username = await secureStorageRead(STORAGE_KEY_USERNAME)
        const password = await secureStorageRead(STORAGE_KEY_PASSWORD)

        if (username) {
          setValue("email", username)
        }
        if (password) {
          setValue("password", password)
        }
      }
    } catch (e) {
      toast.error({
        title: "Getting saved login failed",
      })
    }
  }

  React.useEffect(() => {
    setLoginError("")
    ;(async () => {
      // if bio available and is remembered, fill with bio
      const compatible = await LocalAuthentication.hasHardwareAsync()
      setIsBiometricSupported(compatible)

      const rememberlogin = await secureStorageRead(STORAGE_KEY_REMEMBERLOGIN)
      if (rememberlogin === "true" && compatible) {
        setValue("rememberDevice", true)
        handleFillInWithBio()
      }
    })()
  }, [])

  return (
    <Screen preset="scroll" safeAreaEdges={["top", "bottom"]}>
      <Stack space={4} py={spacing.extraSmall}>
        <Stack space={12} px={spacing.extraSmall}>
          <Stack space={4}>
            <Text
              colorToken="text"
              textAlign={"center"}
              preset="heading"
              tx="loginScreen.enterAlt"
            />
            <Text
              colorToken="text.softer"
              textAlign={"center"}
              tx="loginScreen.enterAltDescription"
            />
          </Stack>
          <Stack space={4}>
            <FormControl
              name="email"
              control={control}
              textContentType="username"
              placeholderTx="fieldLabels.email"
              keyboardType="email-address"
              autoCapitalize="none"
              errors={errors}
              autoComplete="email"
              autoCorrect={false}
              InputLeftElement={<Icon ml={3} colorToken="text.softer" icon="atSymbol" />}
            ></FormControl>

            <FormControl
              name="password"
              type="password"
              textContentType="password"
              control={control}
              errors={errors}
              placeholderTx="fieldLabels.password"
              defaultSecureEntry={true}
              // keyboardType="password"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
              InputLeftElement={<Icon ml={3} colorToken="text.softer" icon="key" />}
            ></FormControl>

            {isBiometricSupported && (
              <FormSingleCheckbox
                name="rememberDevice"
                control={control}
                colorScheme="secondary"
                errors={errors}
                labelTx="fieldLabels.rememberDevice"
              ></FormSingleCheckbox>
            )}
          </Stack>

          {!isSubmitting && loginError ? (
            <Butter.Error title={"Error!"} description={loginError}></Butter.Error>
          ) : null}

          <Stack space={4}>
            <Button
              isLoading={isSubmitting}
              colorScheme="secondary"
              tx="loginScreen.login"
              onPress={handleSubmit(onSubmit)}
              rightIcon={<Icon icon="arrowRightLong" />}
            ></Button>

            <Button onPress={handleOnBack} tx="loginScreen.backToLogin"></Button>
          </Stack>

          <Text
            textAlign={"center"}
            preset="legal"
            colorToken="text.softer"
            text="By continuing, you acknowledge that you have read, understood, and agree to CurrentClient Terms of Service and Privacy Policy"
          />
        </Stack>
      </Stack>
    </Screen>
  )
})
