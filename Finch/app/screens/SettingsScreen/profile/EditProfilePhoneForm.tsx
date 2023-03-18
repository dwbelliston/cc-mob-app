import { Stack } from "native-base"
import React from "react"
import * as yup from "yup"

import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import { BottomSheetFormControl } from "../../../components/FormControl"
import { spacing } from "../../../theme"
import { REGEX_PHONE } from "../../../utils/constants"
import { FormHandle } from "./ProfileScreen"

export interface IEditProfilePhoneFormInput {
  Phone: string
}

interface IProps {
  data: IEditProfilePhoneFormInput
  onSubmit: (data: IEditProfilePhoneFormInput) => void
}

const schema = yup.object({
  Phone: yup.string().matches(REGEX_PHONE, "Use 10 digit phone"),
})

export const EditProfilePhoneForm = React.forwardRef<FormHandle, IProps>(
  ({ onSubmit, data }, ref) => {
    const form = useForm<IEditProfilePhoneFormInput>({
      resolver: yupResolver(schema),
      defaultValues: data,
    })

    const handleOnInvalid = () => {}

    const handleOnValid = (data: IEditProfilePhoneFormInput) => {
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
        <BottomSheetFormControl
          name="Phone"
          control={form.control}
          multiline={false}
          labelProps={{
            tx: "fieldLabels.phone",
          }}
          textContentType="telephoneNumber"
          keyboardType="phone-pad"
        ></BottomSheetFormControl>
      </Stack>
    )
  },
)
