import { HStack, Pressable, useColorModeValue } from "native-base"

import React from "react"
import { useSharedValue } from "react-native-reanimated"

import { Text } from "../../components"
import { AnimatedBackground } from "../../components/AnimatedBackground"
import { ContactAvatar } from "../../components/ContactAvatar"
import { spacing } from "../../theme"
import { getInitials } from "../../utils/getInitials"

interface IProps {
  onPress: () => void
  name: string
}

export const ContactSmudgePressable = ({ onPress, name }: IProps) => {
  const progress = useSharedValue(0)
  const [initials, setInitials] = React.useState("")

  const avatarBg = useColorModeValue("primary.400", "primary.600")
  const colorMatch = useColorModeValue("primary.500", "primary.200")

  const handleOnPress = () => {
    progress.value = 1
    onPress()
  }

  React.useEffect(() => {
    setInitials(getInitials(name))
  }, [name])

  return (
    <Pressable onPress={handleOnPress} rounded="full" overflow={"hidden"}>
      <AnimatedBackground
        sharedValue={progress}
        bgStart="contactSmudgeBgStart"
        bgEnd={"contactSmudgeBgEnd"}
      >
        <HStack w="full" space={spacing.micro} px={spacing.tiny} py={0.5} alignItems="center">
          <ContactAvatar
            avatarColor={avatarBg}
            initials={initials}
            avatarProps={{ size: "xs" }}
            onPress={handleOnPress}
          ></ContactAvatar>
          <Text
            maxW={32}
            fontWeight="semibold"
            isTruncated={true}
            color={colorMatch}
            text={name}
          ></Text>
        </HStack>
      </AnimatedBackground>
    </Pressable>
  )
}
