import { Box, Divider, HStack, useColorModeValue } from "native-base"
import React from "react"
import { Text } from "../../components"
import { colors, spacing } from "../../theme"

interface IProps {
  label?: string
}

const ConversationDivider = ({ label }: IProps) => {
  const border = useColorModeValue(colors.gray[400], colors.gray[800])

  if (!label) {
    return null
  }

  return (
    <HStack w="full" py={4} alignItems="center">
      <Divider opacity={0.5} bg={border} flex={1} />
      <Box flex={2} px={spacing.tiny} py={spacing.micro}>
        <Text textAlign={"center"} text={label} fontSize="sm" colorToken="text.softer"></Text>
      </Box>
      <Divider opacity={0.5} bg={border} flex={1} />
    </HStack>
  )
}

export default ConversationDivider
