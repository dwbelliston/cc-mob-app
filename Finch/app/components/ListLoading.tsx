import { Box, Center, IBoxProps, Spinner, Stack } from "native-base"
import { spacing } from "../theme"
import { Text, TextProps } from "./Text"

interface IProps extends IBoxProps {
  tx: TextProps["tx"]
}

export const LoadingWithText = ({ tx, ...rest }: IProps) => {
  return (
    <Box {...rest}>
      <Center flex={1}>
        <Stack space={spacing.extraSmall}>
          <Spinner></Spinner>
          <Text textAlign={"center"} colorToken="text.softer" tx={tx}></Text>
        </Stack>
      </Center>
    </Box>
  )
}
