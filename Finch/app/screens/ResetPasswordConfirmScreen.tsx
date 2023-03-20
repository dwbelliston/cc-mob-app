import { yupResolver } from "@hookform/resolvers/yup"
import { observer } from "mobx-react-lite"
import { HStack, PresenceTransition, Stack, View } from "native-base"
import React, { FC, useEffect, useState } from "react"

import * as yup from "yup"

import { Control, useForm, UseFormSetValue, useWatch } from "react-hook-form"
import { useStores } from "../models"
import { AppStackScreenProps } from "../navigators"

import { Button, Icon, IconButton, Screen, Text } from "../components"
import { FormControl } from "../components/FormControl"
import { StatusToggleBadge } from "../components/StatusToggleBadge"
import { translate } from "../i18n"
import { spacing } from "../theme"
import { useCustomToast } from "../utils/useCustomToast"

type IFormInputs = {
  email: string
  code: string
  password: string
  confirmPassword: string
  isPasswordValid?: boolean
}

const VALID_EMAIL_CODE_COUNT = 6

export const PasswordChecker = ({
  control,
  setValue,
  isDisplayed,
  error,
}: {
  control: Control<any>
  setValue: UseFormSetValue<any>
  isDisplayed: boolean
  error?: string
}) => {
  const passwordVal = useWatch({
    control,
    name: "password",
  })

  const [isUppercase, setIsUppercase] = React.useState(false)
  const [isLowercase, setIsLowercase] = React.useState(false)
  const [isSymbol, setIsSymbol] = React.useState(false)
  const [isNumber, setIsNumber] = React.useState(false)

  React.useEffect(() => {
    const isUppercaseUpdate = /[A-Z]/.test(passwordVal)
    const isLowercaseUpdate = /[a-z]/.test(passwordVal)
    const isNumberUpdate = /\d/.test(passwordVal)
    const isSymbolUpdate = /[\^\$\*\.\[\]\{\}\(\)\?"!@#%&,\>\<':;|_~]/.test(passwordVal)

    if (!isUppercaseUpdate || !isLowercaseUpdate || !isNumberUpdate || !isSymbolUpdate) {
      setValue("isPasswordValid", false)
    } else {
      setValue("isPasswordValid", true)
    }

    setIsUppercase(isUppercaseUpdate)
    setIsLowercase(isLowercaseUpdate)
    setIsNumber(isNumberUpdate)
    setIsSymbol(isSymbolUpdate)
  }, [passwordVal, isUppercase, isLowercase, isNumber, isSymbol])

  if (!isDisplayed) {
    return null
  }

  return (
    <PresenceTransition
      visible={isDisplayed}
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
        transition: {
          duration: 250,
        },
      }}
    >
      <Stack space={2}>
        <Text
          colorToken={"text.softer"}
          textAlign="center"
          tx="loginScreen.passwordRequirements"
        ></Text>

        <StatusToggleBadge
          isValid={isUppercase}
          textProps={{
            tx: "loginScreen.uppercase",
          }}
        ></StatusToggleBadge>
        <StatusToggleBadge
          isValid={isLowercase}
          textProps={{
            tx: "loginScreen.lowercase",
          }}
        ></StatusToggleBadge>
        <StatusToggleBadge
          isValid={isNumber}
          textProps={{
            tx: "loginScreen.number",
          }}
        ></StatusToggleBadge>
        <StatusToggleBadge
          isValid={isSymbol}
          textProps={{
            tx: "loginScreen.symbol",
          }}
        ></StatusToggleBadge>
        <Text fontSize={"xs"} colorToken="error" fontFamily={"mono"}>
          {error}
        </Text>
      </Stack>
    </PresenceTransition>
  )
}

const schema = yup.object({
  email: yup.string().required("Required"),
  code: yup
    .string()
    .min(VALID_EMAIL_CODE_COUNT, `Please input ${VALID_EMAIL_CODE_COUNT} digit code`)
    .required("Required"),
  password: yup.string().min(8, "Please use at least 8 characters").required("Required"),
  confirmPassword: yup
    .string()
    .required("Please retype your password.")
    .oneOf([yup.ref("password")], "Your passwords do not match."),
  isPasswordValid: yup
    .boolean()
    .required("Required")
    .oneOf([true], translate("loginScreen.pleaseImprovePassword")),
})

interface ResetPasswordConfirmScreenProps extends AppStackScreenProps<"ResetPasswordConfirm"> {}

export const ResetPasswordConfirmScreen: FC<ResetPasswordConfirmScreenProps> = observer(
  function ResetPasswordConfirmScreen(_props) {
    const { route, navigation } = _props

    const {
      authenticationStore: { resetPasswordConfirmError, resetPasswordConfirm },
    } = useStores()

    const [isSubmitting, setIsSubmitting] = useState(false)

    const toast = useCustomToast()

    const {
      control,
      handleSubmit,
      setValue,
      getValues,
      formState: { errors, isSubmitted },
    } = useForm<IFormInputs>({
      resolver: yupResolver(schema),
      defaultValues: {
        email: "",
        code: "",
      },
    })

    const handleOnBackToLogin = () => {
      const enteredEmail = getValues("email")

      navigation.navigate("Login", { username: enteredEmail })
    }

    const onSubmit = async (data: IFormInputs) => {
      setIsSubmitting(true)

      try {
        await resetPasswordConfirm(data.email, data.code, data.password)
        navigation.navigate("Login", { username: data.email })
      } catch (e) {}
      setIsSubmitting(false)
    }

    useEffect(() => {
      // Here is where you could fetch credentials from keychain or storage
      // and pre-fill the form fields.
      if (route.params?.email) {
        setValue("email", route.params?.email)
      }
    }, [route])

    return (
      <Screen preset="scroll" safeAreaEdges={["top", "bottom"]}>
        <Stack space={4} py={spacing.extraSmall}>
          <Stack space={12} px={spacing.extraSmall}>
            <Stack space={4}>
              <HStack>
                <IconButton
                  size="xs"
                  onPress={handleOnBackToLogin}
                  rounded="full"
                  // variant={"subtle"}
                  icon={<Icon size={20} colorToken="text" icon="arrowLeftLong" />}
                />
              </HStack>
              <Text
                colorToken="text"
                textAlign={"center"}
                preset="heading"
                tx="loginScreen.resetPasswordConfirm"
              />
              <Text
                colorToken="text.softer"
                textAlign={"center"}
                tx="loginScreen.resetPasswordConfirmDescription"
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
                name="code"
                placeholderTx="fieldLabels.code"
                // type="code"
                codeCount={VALID_EMAIL_CODE_COUNT}
                control={control}
                errors={errors}
                InputLeftElement={<Icon ml={3} colorToken="text.softer" icon="shieldCheck" />}
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

              <FormControl
                name="confirmPassword"
                type="password"
                textContentType="password"
                control={control}
                errors={errors}
                placeholderTx="fieldLabels.confirmPassword"
                defaultSecureEntry={true}
                // keyboardType="password"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect={false}
                InputLeftElement={<Icon ml={3} colorToken="text.softer" icon="key" />}
              ></FormControl>

              <PasswordChecker
                control={control}
                setValue={setValue}
                isDisplayed={isSubmitted}
                error={errors?.isPasswordValid?.message}
              ></PasswordChecker>

              {resetPasswordConfirmError && (
                <View>
                  <Text colorToken="error" text={resetPasswordConfirmError} />
                </View>
              )}
            </Stack>

            {/* {!isSubmitting && loginError ? (
              <Butter.Error title={"Error!"} description={loginError}></Butter.Error>
            ) : null} */}

            <Stack space={4}>
              <Button
                isLoading={isSubmitting}
                colorScheme="primary"
                tx="common.reset"
                onPress={handleSubmit(onSubmit)}
                rightIcon={<Icon icon="arrowRightLong" />}
              ></Button>
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
  },
)
