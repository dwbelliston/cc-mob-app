import { yupResolver } from "@hookform/resolvers/yup"
import * as LocalAuthentication from "expo-local-authentication"
import { observer } from "mobx-react-lite"
import { Box, HStack, Image, Stack, useColorModeValue } from "native-base"
import React, { FC } from "react"
import { useForm } from "react-hook-form"
import { ImageBackground } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import * as Sentry from "sentry-expo"
import * as yup from "yup"
import appConfig from "../../app-config"
import { Button, Icon, IconButton, Screen, Text } from "../components"
import { Butter } from "../components/Butter"
import { FormControl } from "../components/FormControl"
import { FormSingleCheckbox } from "../components/FormSingleCheckbox"
import { translate } from "../i18n"
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

// const welcomeLogo = require("../../assets/images/img-concentric.png")
const welcomeLogo = require("../../assets/images/img-logo-center.png")

const imgLightSrc = require("../../assets/images/img-lattice-fade-light.png")
const imgDarkSrc = require("../../assets/images/img-lattice-fade-dark.png")

const STORAGE_KEY_REMEMBERLOGIN = "v1.rememberlogin"
const STORAGE_KEY_USERNAME = "v1.username"
const STORAGE_KEY_PASSWORD = "v1.password"

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

export const LoginScreen: FC<AppStackScreenProps<"Login">> = observer(function LoginScreen(_props) {
  const { route, navigation } = _props

  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [attemptsCount, setAttemptsCount] = React.useState(0)
  const [isBiometricSupported, setIsBiometricSupported] = React.useState<boolean>(true)

  const appVersion = `App version: ${appConfig.version}`

  const imgSrc = useColorModeValue(imgLightSrc, imgDarkSrc)

  const {
    authenticationStore: { loginError, login, resetErrors },
  } = useStores()

  const { top: insetTop, bottom: insetBottom } = useSafeAreaInsets()

  // Pull in navigation via hook
  // const navigation = useNavigation()
  const toast = useCustomToast()

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
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
    resetErrors()

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

  const handleOnReset = () => {
    const enteredEmail = getValues("email")
    resetErrors()

    navigation.navigate("ResetPassword", { email: enteredEmail })
  }

  const handleOnAltLogin = () => {
    resetErrors()
    navigation.navigate("AltLogin")
  }

  const handleFillInWithBio = async () => {
    try {
      const biometricAuth = await LocalAuthentication.authenticateAsync({
        promptMessage: translate("loginScreen.useLogin"),
        disableDeviceFallback: true,
        cancelLabel: translate("common.cancel"),
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
      } else {
        Sentry.Native.captureException(biometricAuth)
        toast.warning({
          title: translate("common.error"),
          description: translate("loginScreen.bioNotAvailable"),
        })
      }
    } catch (e) {
      toast.error({
        title: translate("common.error"),
        description: translate("loginScreen.bioNotAvailable"),
      })
    }
  }

  React.useEffect(() => {
    // Here is where you could fetch credentials from keychain or storage
    // and pre-fill the form fields.
    if (route.params?.username) {
      setValue("email", route.params?.username)
    }
    if (route.params?.password) {
      setValue("password", route.params?.password)
    }
  }, [route])

  React.useEffect(() => {
    resetErrors()
    ;(async () => {
      // if bio available and is remembered, fill with bio
      const compatible = await LocalAuthentication.hasHardwareAsync()

      setIsBiometricSupported(compatible)

      const rememberlogin = await secureStorageRead(STORAGE_KEY_REMEMBERLOGIN)
      if (rememberlogin === "true" && compatible) {
        setValue("rememberDevice", true)
        // handleFillInWithBio()
      }
    })()
  }, [])

  return (
    <Screen preset="scroll" safeAreaEdges={["top", "bottom"]}>
      <Stack space={4} pb={spacing.extraSmall}>
        <ImageBackground source={imgSrc} resizeMode="cover">
          <Box>
            <Image
              height="48"
              width="100%"
              source={welcomeLogo}
              resizeMode="contain"
              alt="CurrentClient logo"
            />
          </Box>
        </ImageBackground>

        <Stack space={12} px={spacing.extraSmall}>
          <Text colorToken="text" textAlign={"center"} preset="heading" tx="loginScreen.enter" />

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
              <HStack justifyContent={"space-between"} alignItems="center">
                <FormSingleCheckbox
                  name="rememberDevice"
                  control={control}
                  errors={errors}
                  labelTx="fieldLabels.rememberDevice"
                ></FormSingleCheckbox>
                <IconButton
                  size="sm"
                  onPress={handleFillInWithBio}
                  rounded="full"
                  icon={<Icon colorToken="text" icon="fingerPrint" size={16} />}
                ></IconButton>
              </HStack>
            )}
          </Stack>

          {!isSubmitting && loginError ? (
            <Butter.Error title={"Error!"} description={loginError}></Butter.Error>
          ) : null}

          <Stack space={4}>
            <Button
              isLoading={isSubmitting}
              colorScheme="primary"
              tx="loginScreen.login"
              onPress={handleSubmit(onSubmit)}
              rightIcon={<Icon icon="arrowRightLong" />}
            ></Button>

            <Button onPress={handleOnAltLogin} tx="loginScreen.altLogin"></Button>
            <Button onPress={handleOnReset} tx="loginScreen.forgotPassword"></Button>
          </Stack>

          <Text textAlign={"center"} preset="legal" colorToken="text.softer" tx="legal.terms" />

          <Text
            textAlign={"center"}
            preset="legal"
            colorToken={"text.softer"}
            text={appVersion}
          ></Text>
        </Stack>
      </Stack>
    </Screen>
  )
})
