import * as Haptics from "expo-haptics"
import { IPressableProps, Pressable, Stack, useColorModeValue } from "native-base"
import React from "react"
import { useSharedValue } from "react-native-reanimated"
import { Icon, IconProps, Text, TextProps } from "../../components"
import { AnimatedBackground } from "../../components/AnimatedBackground"
import { ColorOption, colors, spacing } from "../../theme"

export interface ILibraryRoomPressableProps extends IPressableProps {
  icon?: IconProps
  label: TextProps["tx"]
  colorScheme: ColorOption
  onPress: () => void
}

export const LibraryRoomPressable = ({
  label,
  icon,
  colorScheme,
  onPress,

  ...rest
}: ILibraryRoomPressableProps) => {
  const progress = useSharedValue(0)

  const cardBg = useColorModeValue(colors[colorScheme][50], colors[colorScheme][800])
  const cardBgEnd = useColorModeValue(colors[colorScheme][100], colors[colorScheme][700])
  const cardBorder = useColorModeValue(colors[colorScheme][200], colors[colorScheme][900])
  const cardColor = useColorModeValue(colors[colorScheme][600], colors[colorScheme][400])

  const handleOnPress = () => {
    if (onPress) {
      progress.value = 1
      Haptics.selectionAsync()
      onPress()
    }
  }

  return (
    <Pressable
      {...rest}
      onPress={handleOnPress}
      borderWidth={1}
      borderColor={cardBorder}
      overflow="hidden"
      rounded="lg"
    >
      <AnimatedBackground sharedValue={progress} bgStartColor={cardBg} bgEndColor={cardBgEnd}>
        <Stack
          h="full"
          space={1}
          px={spacing.tiny}
          // bg={cardBg}

          alignItems="center"
          justifyContent={"center"}
          py={spacing.extraSmall}
        >
          <Icon color={cardColor} size={32} {...icon} />
          <Text color={cardColor} fontWeight="bold" tx={label}></Text>
        </Stack>
      </AnimatedBackground>
    </Pressable>
  )
}
