import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { Box, Image, Stack } from "native-base"
import React, { FC } from "react"
import { Button, Icon, Screen, Text, TextField } from "../components"
import { AppStackScreenProps } from "../navigators"
import { spacing } from "../theme"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../models"

const welcomeLogo = require("../../assets/images/img-concentric.png")

// STOP! READ ME FIRST!
// To fix the TS error below, you'll need to add the following things in your navigation config:
// - Add `Login: undefined` to AppStackParamList
// - Import your screen, and add it to the stack:
//     `<Stack.Screen name="Login" component={LoginScreen} />`
// Hint: Look for the 🔥!

// REMOVE ME! ⬇️ This TS ignore will not be necessary after you've added the correct navigator param type
// @ts-ignore
export const LoginScreen: FC<StackScreenProps<AppStackScreenProps, "Login">> = observer(
  function LoginScreen() {
    // Pull in one of our MST stores
    // const { someStore, anotherStore } = useStores()

    // Pull in navigation via hook
    // const navigation = useNavigation()

    return (
      <Screen preset="scroll" safeAreaEdges={["top", "bottom"]}>
        <Stack space={4} py={spacing.extraSmall}>
          <Box>
            <Image
              height="48"
              width="100%"
              source={welcomeLogo}
              resizeMode="contain"
              alt="geneial logo"
            />
          </Box>

          <Text colorToken="text" textAlign={"center"} preset="heading" tx="loginScreen.enter" />

          <Stack space={12} px={spacing.extraSmall}>
            <Stack space={4}>
              <TextField placeholder="Email"></TextField>
              <TextField placeholder="Password"></TextField>
            </Stack>

            <Stack space={4}>
              <Button
                // variant={"subtle"}
                colorScheme="primary"
                tx="loginScreen.login"
                // onPress={goLogin}
                rightIcon={<Icon icon="arrowRightLong" />}
              ></Button>

              <Button tx="loginScreen.resetPassword"></Button>
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
