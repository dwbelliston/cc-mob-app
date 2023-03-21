import { Stack } from "native-base"
import React from "react"
import * as yup from "yup"

import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"

import { BottomSheetFormControl } from "../../components/FormControl"
import { IContact, IContactUpdate } from "../../models/Contact"
import { spacing } from "../../theme"
import { FormHandle } from "./ContactDetailScreen"

interface IProps {
  onSubmit: (data: IContactUpdate) => void
  data: IContact
}

const schema = yup.object({
  Address1: yup.string(),
  Address2: yup.string(),
  City: yup.string(),
  State: yup.string(),
  Zip: yup.string(),
})

export const EditContactAddressForm = React.forwardRef<FormHandle, IProps>(
  ({ onSubmit, data }, ref) => {
    const form = useForm<IContactUpdate>({
      resolver: yupResolver(schema),
      defaultValues: data,
    })

    const handleOnInvalid = () => {}

    const handleOnValid = (data: IContactUpdate) => {
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
          name="Address1"
          control={form.control}
          multiline={false}
          labelProps={{
            tx: "fieldLabels.address",
          }}
          textContentType="streetAddressLine1"
          autoComplete="street-address"
        ></BottomSheetFormControl>
        <BottomSheetFormControl
          name="Address2"
          control={form.control}
          multiline={false}
          maxWidth={32}
          labelProps={{
            tx: "fieldLabels.addressSte",
          }}
          textContentType="streetAddressLine2"
        ></BottomSheetFormControl>
        <BottomSheetFormControl
          name="City"
          control={form.control}
          multiline={false}
          labelProps={{
            tx: "fieldLabels.city",
          }}
          textContentType="addressCity"
        ></BottomSheetFormControl>
        <BottomSheetFormControl
          name="State"
          control={form.control}
          multiline={false}
          labelProps={{
            tx: "fieldLabels.state",
          }}
          textContentType="addressState"
        ></BottomSheetFormControl>
        <BottomSheetFormControl
          name="Zip"
          control={form.control}
          multiline={false}
          labelProps={{
            tx: "fieldLabels.zip",
          }}
          textContentType="postalCode"
        ></BottomSheetFormControl>
      </Stack>
    )
  },
)
