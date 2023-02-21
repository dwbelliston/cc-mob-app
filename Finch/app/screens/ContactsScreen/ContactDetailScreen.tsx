import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import { ViewStyle } from "react-native"
import { Screen, Text } from "../../components"
import { ContactsStackScreenProps } from "./ContactsStack"

export const ContactDetailScreen: FC<ContactsStackScreenProps<"ContactDetail">> = observer(
  function ContactDetailScreen() {
    // Pull in one of our MST stores
    // const { someStore, anotherStore } = useStores()

    // Pull in navigation via hook
    // const navigation = useNavigation()
    return (
      <Screen style={$root} preset="scroll">
        <Text text="contactDetail" />
      </Screen>
    )
  },
)

const $root: ViewStyle = {
  flex: 1,
}
