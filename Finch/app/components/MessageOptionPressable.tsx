import { HStack, Pressable } from "native-base"
import { useSharedValue } from "react-native-reanimated"
import { AnimatedBackground } from "./AnimatedBackground"
import { Text } from "./Text"

export const MessageOptionPressable = ({ msgBody, onPress }) => {
  const progress = useSharedValue(0)

  const handleOnPress = () => {
    progress.value = 1
    onPress()
  }

  return (
    <Pressable onPress={handleOnPress}>
      <AnimatedBackground
        sharedValue={progress}
        bgStart="bg.high"
        bgEnd={"bg.higher"}
        styles={{ borderRadius: 12 }}
      >
        <HStack space={8} p={2} py={3} px={4}>
          <Text>{msgBody}</Text>
        </HStack>
      </AnimatedBackground>
    </Pressable>
  )
}
