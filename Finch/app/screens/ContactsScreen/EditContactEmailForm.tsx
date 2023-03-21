import { Stack } from "native-base"
import React from "react"
import * as yup from "yup"

import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import { Icon } from "../../components"
import { Butter } from "../../components/Butter"
import { BottomSheetFormControl } from "../../components/FormControl"
import { IContact, IContactUpdate } from "../../models/Contact"
import useReadCrmSync from "../../services/api/crmsync/queries/useReadCrmSync"
import useReadUserProfile from "../../services/api/userprofile/queries/useReadUserProfile"
import { spacing } from "../../theme"
import { FormHandle } from "./ContactDetailScreen"

interface IProps {
  onSubmit: (data: IContactUpdate) => void
  data: IContact
}

export const schema = yup.object().shape({
  Email: yup.string().email("Please use name@domain.com pattern"),
})

export const EditContactEmailForm = React.forwardRef<FormHandle, IProps>(
  ({ onSubmit, data }, ref) => {
    const { data: userProfile } = useReadUserProfile()
    const { data: dataCrmSync, isLoading: isLoadingCrmSync } = useReadCrmSync(userProfile?.UserId)

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
        {dataCrmSync?.IsEnabled ? (
          <Butter.Warning
            titleText={{ tx: "crmSync.warning" }}
            descriptionText={{ tx: "crmSync.warningMore", fontSize: "xs" }}
          ></Butter.Warning>
        ) : null}

        <BottomSheetFormControl
          name="Email"
          control={form.control}
          labelProps={{
            tx: "fieldLabels.email",
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          InputLeftElement={<Icon ml={3} colorToken="text.softer" icon="atSymbol" />}
        ></BottomSheetFormControl>
      </Stack>
    )
  },
)
