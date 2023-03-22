import { Stack } from "native-base"
import React from "react"
import * as yup from "yup"

import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import { Icon } from "../../components"
import { Butter } from "../../components/Butter"
import { BottomSheetFormControl } from "../../components/FormControl"
import { IContactCreate } from "../../models/Contact"
import useReadCrmSync from "../../services/api/crmsync/queries/useReadCrmSync"
import useReadUserProfile from "../../services/api/userprofile/queries/useReadUserProfile"
import { spacing } from "../../theme"
import { REGEX_PHONE } from "../../utils/constants"

interface IProps {
  onSubmit: (data: IContactCreate) => void
  phone?: string
}

export type AddContactSheetFormHandle = {
  submitForm: () => void
}

export const schema = yup.object().shape({
  FirstName: yup.string().required("Required"),
  LastName: yup.string().required("Required"),
  Phone: yup.string().matches(REGEX_PHONE, "Use 10 digit phone"),
})

export const AddContactSheetForm = React.forwardRef<AddContactSheetFormHandle, IProps>(
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

        <BottomSheetFormControl
          name="Phone"
          control={form.control}
          multiline={false}
          labelProps={{
            tx: "fieldLabels.phone",
          }}
          textContentType="telephoneNumber"
          keyboardType="phone-pad"
          InputLeftElement={<Icon ml={3} colorToken="text.softer" icon="phone" />}
        ></BottomSheetFormControl>
      </Stack>
    )
  },
)
