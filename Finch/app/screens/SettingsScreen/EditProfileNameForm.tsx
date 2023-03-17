import { Stack } from "native-base"
import React from "react"
import * as yup from "yup"

import { BottomSheetFormControl } from "../../components/FormControl"
import { spacing } from "../../theme"

import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import { FormHandle } from "./ProfileScreen"

export interface IEditProfileNameFormInput {
  FirstName: string
  LastName: string
}

interface IProps {
  data: IEditProfileNameFormInput
  onSubmit: (data: IEditProfileNameFormInput) => void
}

const schema = yup.object({
  FirstName: yup.string().required("Required"),
  LastName: yup.string().required("Required"),
})

export const EditProfileNameForm = React.forwardRef<FormHandle, IProps>(
  ({ onSubmit, data }, ref) => {
    const form = useForm<IEditProfileNameFormInput>({
      resolver: yupResolver(schema),
      defaultValues: data,
    })

    const handleOnInvalid = () => {}

    const handleOnValid = (data: IEditProfileNameFormInput) => {
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
          name="FirstName"
          control={form.control}
          multiline={false}
          labelProps={{
            tx: "fieldLabels.firstName",
          }}
          textContentType="givenName"
          autoComplete="name-given"
          autoCapitalize="sentences"
        ></BottomSheetFormControl>
        <BottomSheetFormControl
          name="LastName"
          control={form.control}
          multiline={false}
          labelProps={{
            tx: "fieldLabels.lastName",
          }}
          textContentType="familyName"
          autoComplete="name-family"
          autoCapitalize="sentences"
        ></BottomSheetFormControl>
      </Stack>
    )
  },
)
