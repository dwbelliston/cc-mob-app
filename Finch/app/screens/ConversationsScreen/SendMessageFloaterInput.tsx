/*
SendMessageFloaterInput
*/

import { yupResolver } from "@hookform/resolvers/yup"
import { Box, Button as NBButton, HStack, Stack } from "native-base"
import React from "react"
import { useForm } from "react-hook-form"
import * as yup from "yup"
import { Icon, IconButton } from "../../components"
import { FormControl } from "../../components/FormControl"
import { spacing } from "../../theme"
import { useColor } from "../../theme/useColor"

interface IProps {
  contactName: string
}

type IFormInputs = {
  message: string
}

const schema = yup.object({
  message: yup.string().required("Required"),
})

const SendMessageFloaterInput = ({ contactName }: IProps) => {
  const bgMain = useColor("bg.main")
  const borderColor = useColor("bg.high")

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isValid },
  } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      message: "",
    },
  })

  const handleSend = async (data: IFormInputs) => {
    console.log("data", data)
    reset()
  }

  return (
    <Stack
      backgroundColor={bgMain}
      px={spacing.tiny}
      pt={spacing.tiny}
      pb={spacing.micro}
      space={spacing.micro}
      borderTopWidth={1}
      borderColor={borderColor}
    >
      <Box>
        <FormControl
          name="message"
          control={control}
          multiline={true}
          textContentType="username"
          placeholderTx="inbox.enterMessage"
          autoCapitalize="none"
          errors={errors}
          autoComplete="email"
          autoCorrect={false}
        ></FormControl>
      </Box>
      <HStack justifyContent={"space-between"}>
        <NBButton.Group>
          <IconButton
            rounded="full"
            size="sm"
            icon={<Icon colorToken={"text"} icon="documentDuplicate" size={16} />}
          />

          <IconButton
            rounded="full"
            size="sm"
            icon={<Icon colorToken={"text"} icon="paperClip" size={16} />}
          />
        </NBButton.Group>
        <Box>
          <IconButton
            onPress={handleSubmit(handleSend)}
            rounded="full"
            size="sm"
            isDisabled={!isValid}
            colorScheme={"primary"}
            icon={<Icon icon="arrowUp" size={16} />}
          />
        </Box>
      </HStack>
    </Stack>
  )
}

export default SendMessageFloaterInput
