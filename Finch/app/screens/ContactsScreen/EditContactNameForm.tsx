import { Stack } from "native-base"
import React from "react"
import * as yup from "yup"

import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
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
  FirstName: yup.string().required("Required"),
  LastName: yup.string().required("Required"),
})

export const EditContactNameForm = React.forwardRef<FormHandle, IProps>(
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
          name="FirstName"
          control={form.control}
          labelProps={{
            tx: "fieldLabels.firstName",
          }}
        ></BottomSheetFormControl>

        <BottomSheetFormControl
          name="LastName"
          control={form.control}
          labelProps={{
            tx: "fieldLabels.lastName",
          }}
        ></BottomSheetFormControl>
      </Stack>
    )
  },
)
