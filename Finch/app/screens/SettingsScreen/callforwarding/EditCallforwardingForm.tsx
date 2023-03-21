import { Stack } from "native-base"
import React from "react"
import * as yup from "yup"

import { spacing } from "../../../theme"

import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import { FormSingleSwitch } from "../../../components/FormSingleSwitch"

import { Icon } from "../../../components"
import { BottomSheetFormControl } from "../../../components/FormControl"
import { ICallForwardingForm } from "../../../models/CallFlow"
import { REGEX_PHONE } from "../../../utils/constants"
import { FormHandle } from "../profile/ProfileScreen"

interface IProps {
  data: ICallForwardingForm
  onSubmit: (data: ICallForwardingForm) => void
}

const schema = yup.object({
  IsEnableForwardCall: yup.boolean(),
  NumberForwardTo: yup.string().when("IsEnableForwardCall", {
    is: true,
    then: (schema) => schema.matches(REGEX_PHONE, "Use 10 digit phone").required(),
    otherwise: (schema) => schema.nullable(),
  }),
})

export const EditCallforwardingForm = React.forwardRef<FormHandle, IProps>(
  ({ onSubmit, data }, ref) => {
    const form = useForm<ICallForwardingForm>({
      resolver: yupResolver(schema),
      defaultValues: data,
    })

    const handleOnInvalid = () => {}

    const handleOnValid = (data: ICallForwardingForm) => {
      onSubmit(data)
    }

    React.useImperativeHandle(ref, () => ({
      // start() has type inferrence here
      submitForm() {
        form.handleSubmit(handleOnValid, handleOnInvalid)()
      },
    }))

    return (
      <Stack space={spacing.tiny} py={spacing.tiny} px={spacing.tiny}>
        <FormSingleSwitch
          name="IsEnableForwardCall"
          control={form.control}
          colorScheme="primary"
          errors={form.formState.errors}
          labelTx="callforwarding.status"
        ></FormSingleSwitch>

        <BottomSheetFormControl
          name="NumberForwardTo"
          control={form.control}
          multiline={false}
          labelProps={{
            tx: "fieldLabels.number",
          }}
          textContentType="telephoneNumber"
          keyboardType="phone-pad"
          InputLeftElement={<Icon ml={3} colorToken="text.softer" icon="phone" />}
        ></BottomSheetFormControl>
      </Stack>
    )
  },
)
