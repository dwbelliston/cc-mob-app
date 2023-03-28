import * as Haptics from "expo-haptics"
import { HStack, IPressableProps, Pressable } from "native-base"
import React from "react"
import { useSharedValue } from "react-native-reanimated"
import { Icon, IconProps, Text, TextProps } from "../../components"
import { AnimatedBackground } from "../../components/AnimatedBackground"
import { Badge } from "../../components/Badge"
import { Butter } from "../../components/Butter"
import { ColorOption, spacing } from "../../theme"

export interface ILibraryRoomPressableProps extends IPressableProps {
  icon?: IconProps
  label: TextProps["tx"]
  colorScheme: ColorOption
  isSoon?: boolean
  isNew?: boolean
  onPress: () => void
}

export const LibraryRoomPressable = ({
  label,
  icon,
  colorScheme,
  onPress,
  isSoon,
  isNew,
  ...rest
}: ILibraryRoomPressableProps) => {
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
          <HStack flex={2} space={spacing.tiny} alignItems="center">
            <Butter.Icon colorScheme={colorScheme} icon={icon}></Butter.Icon>
            <Text flex={1} noOfLines={1} tx={label}></Text>
          </HStack>
          <HStack space={spacing.tiny} alignItems="center" justifyContent={"flex-end"}>
            {isSoon ? (
              <Badge text={{ fontSize: "xs", tx: "common.soon" }} colorScheme={"gray"} />
            ) : null}
            {isNew ? (
              <Badge text={{ fontSize: "xs", tx: "common.new" }} colorScheme={"green"} />
            ) : null}
            <Icon colorToken={"text.softer"} size={20} icon="chevronRight"></Icon>
          </HStack>
        </HStack>
      </AnimatedBackground>
    </Pressable>
  )
}
