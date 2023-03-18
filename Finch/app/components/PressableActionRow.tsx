import { HStack, Pressable, View } from "native-base"
import { spacing } from "../theme"
import { Icon, IconProps } from "./Icon"
import { Text, TextProps } from "./Text"

interface IProps {
  icon: IconProps
  tx: TextProps["tx"]
  colorToken?: TextProps["colorToken"]
  onPress: () => void
}

export const PressableActionRow = (props: IProps) => {
  const { colorToken, tx, icon, onPress, ...rest } = props

  return (
    <Pressable onPress={onPress}>
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
            <Text colorToken={colorToken} tx={tx}></Text>
          </HStack>
          <Icon colorToken={"text.softer"} size={20} icon="chevronRight"></Icon>
        </HStack>
      </View>
    </Pressable>
  )
}
