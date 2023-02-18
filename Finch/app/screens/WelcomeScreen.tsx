import { observer } from "mobx-react-lite"
import { Stack, Text as NBText, View as NBView } from "native-base"
import React, { FC } from "react"
import { TextStyle, ViewStyle } from "react-native"
import { Button, Screen, Text } from "../components"
import { Butter } from "../components/Butter"
import { AppStackScreenProps } from "../navigators"
import { spacing } from "../theme"
import { useColor } from "../theme/useColor"
import { useSafeAreaInsetsStyle } from "../utils/useSafeAreaInsetsStyle"

const welcomeLogo = require("../../assets/images/logo.png")
const welcomeFace = require("../../assets/images/welcome-face.png")

const COLORS = ["gray", "primary", "secondary", "green", "red"]
const VARIANTS = ["solid", "subtle", "outline"]
const SIZES = ["xs", "sm", "md", "lg"]

export const WelcomeScreen: FC<AppStackScreenProps<"Welcome">> = observer(function WelcomeScreen(
  _props,
) {
  const $bottomContainerInsets = useSafeAreaInsetsStyle(["bottom"])

  const bgMain = useColor("bg.main")

  const handleOnBack = () => {
    _props.navigation.navigate("Login")
  }

  return (
    <Screen preset="scroll">
      <NBView px={spacing.small} bg={bgMain} py={spacing.medium}>
        <Button onPress={handleOnBack} text="Home"></Button>

        <Text tx="welcomeScreen.postscript" size="md" />

        <Stack space={16}>
          {COLORS.map((c) => {
            return (
              <Stack space={6} key={c}>
                <NBText textAlign={"center"} fontSize={"xl"}>
                  {c}
                </NBText>
                {VARIANTS.map((v) => {
                  return (
                    <Stack space={2} key={`${c}${v}`}>
                      {SIZES.map((s) => {
                        return (
                          <Button
                            text="Add 14 contacts"
                            colorScheme={c}
                            size={s}
                            variant={v}
                            key={`${c}${v}${s}`}
                          ></Button>
                        )
                      })}
                    </Stack>
                  )
                })}
              </Stack>
            )
          })}
        </Stack>

        <Stack space={2}>
          <Butter.Success
            title={"Success!"}
            description={"Please double check it"}
          ></Butter.Success>
          <Butter.Info title={"Info!"} description={"Please double check it"}></Butter.Info>
          <Butter.Error title={"Error!"} description={"Please double check it"}></Butter.Error>
          <Butter.Warning
            title={"Warning!"}
            description={"Please double check it"}
          ></Butter.Warning>
        </Stack>
      </NBView>
    </Screen>
  )
})

const $container: ViewStyle = {
  // flex: 1,
  overflow: "scroll",
  // backgroundColor: colors.background,
}

const $welcomeHeading: TextStyle = {
  marginBottom: spacing.medium,
}
