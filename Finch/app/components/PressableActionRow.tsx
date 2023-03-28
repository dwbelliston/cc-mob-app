import * as Haptics from "expo-haptics"
import { HStack, Pressable } from "native-base"
import { useSharedValue } from "react-native-reanimated"
import { spacing } from "../theme"
import { AnimatedBackground } from "./AnimatedBackground"
import { Badge } from "./Badge"
import { Icon, IconProps } from "./Icon"
import { Text, TextProps } from "./Text"

interface IProps {
  icon: IconProps
  tx?: TextProps["tx"]
  text?: TextProps["text"]
  colorToken?: TextProps["colorToken"]
  isSoon?: boolean
  isNew?: boolean
  onPress: () => void
}

export const PressableActionRow = (props: IProps) => {
  const { colorToken, tx, text, icon, onPress, ...rest } = props
  const progress = useSharedValue(0)

  const handleOnPress = () => {
    if (onPress) {
      progress.value = 1
      Haptics.selectionAsync()
      onPress()
    }
  }

  return (
    <Pressable onPress={handleOnPress}>
      <AnimatedBackground sharedValue={progress}>
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
            <Text flex={1} noOfLines={1} colorToken={colorToken} tx={tx} text={text}></Text>
          </HStack>

          <HStack space={spacing.tiny} alignItems="center" justifyContent={"flex-end"}>
            {props.isSoon ? (
              <Badge text={{ fontSize: "xs", tx: "common.comingSoon" }} colorScheme={"gray"} />
            ) : null}
            {props.isNew ? (
              <Badge text={{ fontSize: "xs", tx: "common.new" }} colorScheme={"green"} />
            ) : null}
            <Icon colorToken={"text.softer"} size={20} icon="chevronRight"></Icon>
          </HStack>
        </HStack>
      </AnimatedBackground>
    </Pressable>
  )
}
