import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import { ViewStyle } from "react-native"
import { Screen, Text } from "../components"
import { AppDrawerScreenProps } from "../navigators"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../models"

export const SettingsScreen: FC<AppDrawerScreenProps<"Settings">> = observer(
  function SettingsScreen() {
    // Pull in one of our MST stores
    // const { someStore, anotherStore } = useStores()

    // Pull in navigation via hook
    // const navigation = useNavigation()
    return (
      <Screen style={$root} preset="scroll">
        <Text text="settings" />
      </Screen>
    )
  },
)

const $root: ViewStyle = {
  flex: 1,
}
