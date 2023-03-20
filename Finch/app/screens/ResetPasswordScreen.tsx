import { yupResolver } from "@hookform/resolvers/yup"
import * as Haptics from "expo-haptics"
import { observer } from "mobx-react-lite"
import { HStack, Stack } from "native-base"
import React, { FC } from "react"
import { useForm } from "react-hook-form"
import * as yup from "yup"
import { Button, Icon, IconButton, Screen, Text } from "../components"
import { Butter } from "../components/Butter"
import { FormControl } from "../components/FormControl"
import { useStores } from "../models"
import { AppStackScreenProps } from "../navigators"
import { spacing } from "../theme"
import { useCustomToast } from "../utils/useCustomToast"

// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../models"

const welcomeLogo = require("../../assets/images/img-concentric.png")

type IFormInputs = {
  email: string
}

const schema = yup.object({
  email: yup.string().required("Required"),
})

export const ResetPasswordScreen: FC<AppStackScreenProps<"ResetPassword">> = observer(
  function ResetPasswordScreen(_props) {
    const { route, navigation } = _props

    const [isSubmitting, setIsSubmitting] = React.useState(false)

    const {
      authenticationStore: { setLoginError, loginError, resetPassword },
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
      },
    })

    const onSubmit = async (data: IFormInputs) => {
      setLoginError("")

      setIsSubmitting(true)

      try {
        await resetPassword(data.email)
        toast.success({ title: "Check email" })
        navigation.navigate("ResetPasswordConfirm", { email: data.email })
      } catch (e) {}
      setIsSubmitting(false)
    }

    const handleOnBack = () => {
      setLoginError("")
      Haptics.selectionAsync()
      navigation.goBack()
    }

    const handleOnValidateEmail = () => {
      Haptics.selectionAsync()
      navigation.navigate("ResetPasswordConfirm")
    }

    React.useEffect(() => {
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
                  onPress={handleOnBack}
                  rounded="full"
                  // variant={"subtle"}
                  icon={<Icon size={20} colorToken="text" icon="arrowLeftLong" />}
                />
              </HStack>
              <Text
                colorToken="text"
                textAlign={"center"}
                preset="heading"
                tx="loginScreen.resetPassword"
              />
              <Text
                colorToken="text.softer"
                textAlign={"center"}
                tx="loginScreen.resetPasswordDescription"
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
            </Stack>

            {!isSubmitting && loginError ? (
              <Butter.Error title={"Error!"} description={loginError}></Butter.Error>
            ) : null}

            <Stack space={4}>
              <Button
                isLoading={isSubmitting}
                colorScheme="primary"
                tx="common.reset"
                onPress={handleSubmit(onSubmit)}
                rightIcon={<Icon icon="arrowRightLong" />}
              ></Button>
              <Button
                flex={1}
                colorScheme="gray"
                tx="loginScreen.enterResetCode"
                onPress={handleOnValidateEmail}
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
