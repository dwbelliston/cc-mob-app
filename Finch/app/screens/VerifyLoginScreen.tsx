import { yupResolver } from "@hookform/resolvers/yup"
import { CognitoUser } from "amazon-cognito-identity-js"
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

type IFormInputs = {
  oneTimeCode: string
}

const schema = yup.object({
  oneTimeCode: yup.string().required("Required"),
})

export const VerifyLoginScreen: FC<AppStackScreenProps<"VerifyLogin">> = observer(
  function VerifyLogin(_props) {
    const { route, navigation } = _props

    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const [challengeUser, setChallengeUser] = React.useState<CognitoUser>()

    const {
      authenticationStore: { setLoginError, loginError, confirmLogin },
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
        oneTimeCode: "",
      },
    })

    const handleOnBack = () => {
      setLoginError("")
      Haptics.selectionAsync()
      navigation.goBack()
    }

    const onSubmit = async (data: IFormInputs) => {
      setLoginError("")

      setIsSubmitting(true)

      try {
        await confirmLogin(challengeUser, data.oneTimeCode, "SOFTWARE_TOKEN_MFA")
      } catch (e) {}
      setIsSubmitting(false)
    }

    React.useEffect(() => {
      // Here is where you could fetch credentials from keychain or storage
      // and pre-fill the form fields.
      if (route.params?.user) {
        setChallengeUser(route.params.user)
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
                tx="loginScreen.enterVerify"
              />
              <Text
                colorToken="text.softer"
                textAlign={"center"}
                tx="loginScreen.enterVerifyDescription"
              />
            </Stack>
            <Stack space={4}>
              <FormControl
                name="oneTimeCode"
                control={control}
                placeholderTx="fieldLabels.oneTimeCode"
                keyboardType="number-pad"
                autoCapitalize="none"
                errors={errors}
                autoComplete="sms-otp"
                autoCorrect={false}
                InputLeftElement={<Icon ml={3} colorToken="text.softer" icon="qrCode" />}
              ></FormControl>
            </Stack>

            {!isSubmitting && loginError ? (
              <Butter.Error title={"Error!"} description={loginError}></Butter.Error>
            ) : null}

            <Stack space={4}>
              <Button
                isLoading={isSubmitting}
                colorScheme="primary"
                tx="loginScreen.verify"
                onPress={handleSubmit(onSubmit)}
                rightIcon={<Icon icon="arrowRightLong" />}
              ></Button>
            </Stack>

            <Text
              textAlign={"center"}
              preset="legal"
              colorToken="text.softer"
              text="If you are having issues, please contact us at help@currentclient.com"
            />
          </Stack>
        </Stack>
      </Screen>
    )
  },
)
