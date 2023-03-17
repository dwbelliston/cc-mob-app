import { Stack } from "native-base"
import React from "react"
import * as yup from "yup"

import { BottomSheetFormControl } from "../../components/FormControl"
import { spacing } from "../../theme"

import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import { FormHandle } from "./ProfileScreen"

export interface IEditProfileCompanyNameFormInput {
  CompanyName?: string
}

interface IProps {
  data: IEditProfileCompanyNameFormInput
  onSubmit: (data: IEditProfileCompanyNameFormInput) => void
}

const schema = yup.object({
  CompanyName: yup.string(),
})

export const EditProfileCompanyNameForm = React.forwardRef<FormHandle, IProps>(
  ({ onSubmit, data }, ref) => {
    const form = useForm<IEditProfileCompanyNameFormInput>({
      resolver: yupResolver(schema),
      defaultValues: data,
    })

    const handleOnInvalid = () => {}

    const handleOnValid = (data: IEditProfileCompanyNameFormInput) => {
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
          name="CompanyName"
          control={form.control}
          multiline={false}
          labelProps={{
            tx: "fieldLabels.companyName",
          }}
          autoCapitalize="words"
        ></BottomSheetFormControl>
      </Stack>
    )
  },
)
