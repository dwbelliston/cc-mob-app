import { Stack } from "native-base"
import React from "react"
import * as yup from "yup"

import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import { Icon } from "../../components"
import { Butter } from "../../components/Butter"
import { FormControl } from "../../components/FormControl"
import { IContactCreate } from "../../models/Contact"
import useReadCrmSync from "../../services/api/crmsync/queries/useReadCrmSync"
import useReadUserProfile from "../../services/api/userprofile/queries/useReadUserProfile"
import { spacing } from "../../theme"
import { REGEX_PHONE } from "../../utils/constants"

interface IProps {
  onSubmit: (data: IContactCreate) => void
  phone?: string
}

export type AddContactFormHandle = {
  submitForm: () => void
}

export const schema = yup.object().shape({
  FirstName: yup.string().required("Required"),
  LastName: yup.string().required("Required"),
  Phone: yup.string().matches(REGEX_PHONE, "Use 10 digit phone"),
  Email: yup.string().email("Please use name@domain.com pattern"),
})

export const AddContactForm = React.forwardRef<AddContactFormHandle, IProps>(
  ({ onSubmit, phone }, ref) => {
    const { data: userProfile } = useReadUserProfile()
    const { data: dataCrmSync, isLoading: isLoadingCrmSync } = useReadCrmSync(userProfile?.UserId)

    const form = useForm<IContactCreate>({
      resolver: yupResolver(schema),
      defaultValues: { FirstName: "", LastName: "", Phone: phone },
    })

    const handleOnInvalid = () => {}

    const handleOnValid = (data: IContactCreate) => {
      onSubmit(data)
    }

    React.useImperativeHandle(ref, () => ({
      // start() has type inferrence here
      submitForm() {
        form.handleSubmit(handleOnValid, handleOnInvalid)()
      },
    }))

    return (
      <Stack space={spacing.extraSmall}>
        {dataCrmSync?.IsEnabled ? (
          <Butter.Warning
            titleText={{ tx: "crmSync.warning" }}
            descriptionText={{ tx: "crmSync.warningMore", fontSize: "xs" }}
          ></Butter.Warning>
        ) : null}
        <Stack space={spacing.tiny}>
          <FormControl
            name="FirstName"
            control={form.control}
            placeholderTx={"fieldLabels.firstName"}
          ></FormControl>
          <FormControl
            name="LastName"
            control={form.control}
            placeholderTx={"fieldLabels.lastName"}
          ></FormControl>

          <FormControl
            name="Phone"
            control={form.control}
            multiline={false}
            placeholderTx={"fieldLabels.phone"}
            textContentType="telephoneNumber"
            keyboardType="phone-pad"
            InputLeftElement={<Icon ml={3} colorToken="text.softer" icon="phone" />}
          ></FormControl>

          <FormControl
            name="Email"
            control={form.control}
            placeholderTx={"fieldLabels.email"}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            InputLeftElement={<Icon ml={3} colorToken="text.softer" icon="atSymbol" />}
          ></FormControl>
        </Stack>
      </Stack>
    )
  },
)
