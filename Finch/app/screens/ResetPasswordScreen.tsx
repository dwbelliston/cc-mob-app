import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import { ViewStyle } from "react-native"
import { Button, Screen, Text } from "../components"
import { AppStackScreenProps } from "../navigators"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../models"

interface IScreenProps extends AppStackScreenProps<"ResetPassword"> {}

export const ResetPasswordScreen: FC<IScreenProps> = observer(function ResetPasswordScreen(_props) {
  const { navigation } = _props
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()

  const handleOnLogin = () => {
    navigation.navigate("Login")
  }

  return (
    <Screen style={$root} preset="scroll">
      <Text text="resetPassword" />
      <Button onPress={handleOnLogin} tx="loginScreen.login"></Button>
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}
