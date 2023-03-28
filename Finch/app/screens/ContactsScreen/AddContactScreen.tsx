import { useHeaderHeight } from "@react-navigation/elements"
import { observer } from "mobx-react-lite"
import React, { FC } from "react"

import { Button, Screen, Text } from "../../components"
import { IContact, IContactCreate } from "../../models/Contact"

import { Stack } from "native-base"
import { translate } from "../../i18n"
import { AppStackScreenProps } from "../../navigators"
import useCreateContacts from "../../services/api/contacts/mutations/useCreateContacts"
import { spacing } from "../../theme"

import { IConversationUpdate } from "../../models/Conversation"
import useUpdateConversation from "../../services/api/conversations/mutations/useUpdateConversation"
import { useCustomToast } from "../../utils/useCustomToast"
import { runFormatPhoneDigitsStripTo10 } from "../../utils/useFormatPhone"
import { AddContactForm, AddContactFormHandle } from "./AddContactForm"

export const AddContactScreen: FC<AppStackScreenProps<"AddContact">> = observer(
  function AddContactScreen(_props) {
    const { navigation, route } = _props

    const paramPhone = runFormatPhoneDigitsStripTo10(route.params?.contactPhone)
    const paramAssignConversationId = route.params?.assignConversationId

    const formRef = React.useRef<AddContactFormHandle>(null)

    const toast = useCustomToast()
    const headerHeight = useHeaderHeight()

    const { mutateAsync: mutateAsyncCreate, isLoading: isLoadingCreate } = useCreateContacts()
    const { mutateAsync: mutateAsyncConversation } = useUpdateConversation()

    const handleOnAssignConversation = async (newContact: IContact) => {
      // Put contact data on conversation
      const updates: IConversationUpdate = {
        IsRead: true,
        ContactId: newContact.ContactId,
        ContactName: `${newContact.FirstName} ${newContact.LastName}`,
      }

      try {
        await mutateAsyncConversation({
          conversationId: paramAssignConversationId,
          updates,
        })
        toast.success({ title: translate("common.saved") })
        navigation.goBack()
      } catch (e) {
        toast.error({
          title: translate("error.updating"),
          description: translate("inbox.errorAssigningConversation"),
        })
      }
    }

    const handleOnSubmitAddContact = async (data: IContactCreate) => {
      try {
        const res = await mutateAsyncCreate([data])
        toast.success({ title: translate("common.created") })

        if (res.length) {
          const newContact = res[0]
          if (paramAssignConversationId) {
            handleOnAssignConversation(newContact)
          } else {
            navigation.replace("ContactDetail", {
              contactName: `${newContact.FirstName} ${newContact.LastName}`,
              contactId: newContact.ContactId,
            })
            // navigation.navigate("ContactDetail", {
            // })
          }
        }
      } catch (e) {
        toast.error({ title: translate("error.creating") })
      }
    }

    const handleOnSave = () => {
      formRef.current.submitForm()
    }

    return (
      <Screen preset="scroll" keyboardOffset={headerHeight}>
        <Stack space={spacing.extraSmall} py={spacing.tiny} px={spacing.tiny}>
          <AddContactForm ref={formRef} phone={paramPhone} onSubmit={handleOnSubmitAddContact} />
          <Button
            isLoading={isLoadingCreate}
            colorScheme={"primary"}
            onPress={handleOnSave}
            tx="common.create"
          ></Button>
          <Text textAlign={"center"} preset="legal" colorToken="text.softer" tx="legal.contact" />
        </Stack>
      </Screen>
    )
  },
)
