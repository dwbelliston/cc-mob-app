import * as Haptics from "expo-haptics"
import { HStack, Pressable, View } from "native-base"
import { spacing } from "../theme"
import { Icon, IconProps } from "./Icon"
import { Text, TextProps } from "./Text"

interface IProps {
  icon: IconProps
  tx?: TextProps["tx"]
  text?: TextProps["text"]
  colorToken?: TextProps["colorToken"]
  onPress: () => void
}

export const PressableActionRow = (props: IProps) => {
  const { colorToken, tx, text, icon, onPress, ...rest } = props

  const handleOnPress = () => {
    if (onPress) {
      Haptics.selectionAsync()
      onPress()
    }
  }

  return (
    <Pressable onPress={handleOnPress}>
      <View w="full">
        <HStack
          flex={1}
          justifyContent="space-between"
          py={spacing.tiny}
          px={spacing.tiny}
          alignItems="center"
        >
          {/* Icon */}
          <HStack flex={1} space={spacing.tiny} alignItems="center">
            <Icon colorToken={colorToken} size={20} {...icon}></Icon>
            <Text colorToken={colorToken} tx={tx} text={text}></Text>
          </HStack>
          <Icon colorToken={"text.softer"} size={20} icon="chevronRight"></Icon>
        </HStack>
      </View>
    </Pressable>
  )
}
