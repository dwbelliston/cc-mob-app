import { Center, HStack, Stack } from "native-base"
import React from "react"
import { Button, Icon, IconButton, Text } from "../../components"
import { spacing } from "../../theme"

// https://www.twilio.com/docs/voice/sdks/javascript/twiliocall#callsenddigitsdigits

interface IProps {
  trackedKeys?: string[]
  onKeyPress: (val: string) => void
  onKeyDelete: () => void
  onMessagePress: () => void
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

export const DialPad = ({ trackedKeys, onKeyPress, onKeyDelete, onMessagePress }: IProps) => {
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
                <Button
                  key={key.display}
                  rounded="full"
                  h={16}
                  w={16}
                  shadow={"none"}
                  onPress={() => handleOnKey(key)}
                  position={"relative"}
                  p={0}
                >
                  <Stack space={0}>
                    <Center>
                      <Text
                        fontSize="2xl"
                        fontWeight={"semibold"}
                        textAlign="center"
                        maxFontSizeMultiplier={1}
                      >
                        {key.display}
                      </Text>
                    </Center>
                    {!key.isCentered ? (
                      <Text
                        bottom="1"
                        color="gray.400"
                        fontSize="8"
                        fontWeight={"bold"}
                        maxFontSizeMultiplier={1}
                      >
                        {key.subDisplay}
                      </Text>
                    ) : null}
                  </Stack>
                </Button>
              )
            })}
          </HStack>
        )
      })}
      <HStack space={spacing.extraSmall + 2}>
        <Center>
          <IconButton
            isDisabled={trackedKeys?.length < 10}
            colorScheme={"primary"}
            icon={<Icon icon="chatBubbleLeftEllipsis" />}
            rounded="full"
            onPress={onMessagePress}
          ></IconButton>
        </Center>
        <IconButton
          isDisabled={trackedKeys?.length < 10}
          h={16}
          w={16}
          colorScheme={"green"}
          icon={<Icon size={32} icon="phone" />}
          rounded="full"
        ></IconButton>
        <Center>
          <IconButton
            isDisabled={trackedKeys?.length < 1}
            onPress={handleOnDelete}
            icon={<Icon colorToken="text" icon="backspace" />}
            rounded="full"
          ></IconButton>
        </Center>
      </HStack>
    </Stack>
  )
}
