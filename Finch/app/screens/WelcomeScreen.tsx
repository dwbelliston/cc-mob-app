import { observer } from "mobx-react-lite"
import { Stack, Text as NBText, View as NBView } from "native-base"
import React, { FC } from "react"
import { TextStyle, ViewStyle } from "react-native"
import { Button, Screen, Text } from "../components"
import { spacing } from "../theme"
import { useColor } from "../theme/useColor"
import { useSafeAreaInsetsStyle } from "../utils/useSafeAreaInsetsStyle"

const welcomeLogo = require("../../assets/images/logo.png")
const welcomeFace = require("../../assets/images/welcome-face.png")

const COLORS = ["gray", "primary", "secondary", "green", "red"]
const VARIANTS = ["solid", "subtle", "outline"]
const SIZES = ["xs", "sm", "md", "lg"]

export const WelcomeScreen: FC<WelcomeScreenProps> = observer(function WelcomeScreen() {
  const $bottomContainerInsets = useSafeAreaInsetsStyle(["bottom"])

  const bgMain = useColor("bg.main")

  return (
    <Screen preset="scroll">
      <NBView px={spacing.small} bg={bgMain} py={spacing.medium}>
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
