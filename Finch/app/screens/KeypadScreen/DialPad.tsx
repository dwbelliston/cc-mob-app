import { Center, HStack, IPressableProps, Pressable, Stack, useColorModeValue } from "native-base"
import React from "react"

import { Icon, IconButton, Text } from "../../components"
import { spacing } from "../../theme"

// https://www.twilio.com/docs/voice/sdks/javascript/twiliocall#callsenddigitsdigits

interface IProps {
  trackedKeys?: string[]
  onKeyPress: (val: string) => void
  onKeyDelete: () => void
  onCallPress: () => void
  onMessagePress: () => void
  isMessageButtonDisabled?: boolean
  isCallButtonDisabled?: boolean
}

interface IKey {
  display: string
  subDisplay: string
  isCentered?: boolean
}

const KEYS: IKey[][] = [
  [
    { display: "1", subDisplay: "" },
    { display: "2", subDisplay: "A B C" },
    { display: "3", subDisplay: "D E F" },
  ],
  [
    { display: "4", subDisplay: "G H I" },
    { display: "5", subDisplay: "J K L" },
    { display: "6", subDisplay: "M N O" },
  ],
  [
    { display: "7", subDisplay: "P Q R S" },
    { display: "8", subDisplay: "T U V" },
    { display: "9", subDisplay: "W X Y Z" },
  ],
  [
    { display: "*", subDisplay: "", isCentered: true },
    { display: "0", subDisplay: "", isCentered: true },
    { display: "#", subDisplay: "", isCentered: true },
  ],
]

interface IPressableDialKeyProps extends IPressableProps {
  dialKey: IKey
}

const PressableDialKey = ({ dialKey, ...rest }: IPressableDialKeyProps) => {
  return (
    <Pressable {...rest}>
      <Stack space={0} w="full" h="full" alignContent="center" pt={1}>
        <Center w="full">
          <Text fontSize="2xl" fontWeight={"semibold"} textAlign="center" maxFontSizeMultiplier={1}>
            {dialKey.display}
          </Text>
        </Center>
        {!dialKey.isCentered ? (
          <Text
            textAlign={"center"}
            color="gray.400"
            fontSize="10"
            fontWeight={"bold"}
            maxFontSizeMultiplier={1}
          >
            {dialKey.subDisplay}
          </Text>
        ) : null}
      </Stack>
    </Pressable>
  )
}

export const DialPad = ({
  trackedKeys,
  onKeyPress,
  onKeyDelete,
  onMessagePress,
  onCallPress,
  isCallButtonDisabled,
  isMessageButtonDisabled,
}: IProps) => {
  const bgKey = useColorModeValue("gray.100", "gray.800")
  const bgDeleteKey = useColorModeValue("rose.50", "error.800")
  const colorDeleteKey = useColorModeValue("rose.500", "error.800")

  const handleOnKey = (key: IKey) => {
    onKeyPress(key.display)
  }

  const handleOnDelete = () => {
    onKeyDelete()
  }

  return (
    <Stack justifyItems="center" justifyContent="center" alignItems={"center"} space={spacing.tiny}>
      {KEYS.map((keyList, idx) => {
        return (
          <HStack key={idx} space={spacing.extraSmall}>
            {keyList.map((key) => {
              return (
                <PressableDialKey
                  key={key.display}
                  dialKey={key}
                  onPress={() => handleOnKey(key)}
                  rounded="full"
                  bg={bgKey}
                  h={16}
                  w={16}
                  display="block"
                  position={"relative"}
                  p={0}
                />
              )
            })}
          </HStack>
        )
      })}
      <HStack space={spacing.extraSmall + 2}>
        <Center>
          <IconButton
            isDisabled={isMessageButtonDisabled}
            colorScheme={"primary"}
            icon={<Icon icon="chatBubbleLeftEllipsis" />}
            rounded="full"
            onPress={onMessagePress}
          ></IconButton>
        </Center>
        <IconButton
          isDisabled={isCallButtonDisabled}
          onPress={onCallPress}
          h={16}
          w={16}
          colorScheme={"green"}
          icon={<Icon size={32} icon="phone" />}
          rounded="full"
        ></IconButton>
        <Center>
          <Pressable
            isDisabled={trackedKeys?.length < 1}
            rounded="full"
            onPress={handleOnDelete}
            bg={bgDeleteKey}
            h={12}
            w={12}
            display="block"
          >
            <Center w="full" h="full">
              <Icon color={colorDeleteKey} icon="backspace" />
            </Center>
          </Pressable>
        </Center>
      </HStack>
    </Stack>
  )
}
