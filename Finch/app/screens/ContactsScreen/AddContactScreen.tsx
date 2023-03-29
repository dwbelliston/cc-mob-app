import { useHeaderHeight } from "@react-navigation/elements"
import { observer } from "mobx-react-lite"
import React, { FC } from "react"

import { Button, Icon, Screen, Text } from "../../components"
import { IContact, IContactCreate } from "../../models/Contact"

import { Stack, View } from "native-base"
import { translate } from "../../i18n"
import { AppStackScreenProps } from "../../navigators"
import useCreateContacts from "../../services/api/contacts/mutations/useCreateContacts"
import { spacing } from "../../theme"

import { useColorModeValue } from "native-base"
import { ImageBackground } from "react-native"
import { IConversationUpdate } from "../../models/Conversation"
import useUpdateConversation from "../../services/api/conversations/mutations/useUpdateConversation"
import { useCustomToast } from "../../utils/useCustomToast"
import { runFormatPhoneDigitsStripTo10 } from "../../utils/useFormatPhone"
import { AddContactForm, AddContactFormHandle } from "./AddContactForm"

const imgLightSrc = require("../../../assets/images/img-lattice-fade-light.png")
const imgDarkSrc = require("../../../assets/images/img-lattice-fade-dark.png")

export const AddContactScreen: FC<AppStackScreenProps<"AddContact">> = observer(
  function AddContactScreen(_props) {
    const { navigation, route } = _props

    const paramPhone = runFormatPhoneDigitsStripTo10(route.params?.contactPhone)
    const paramAssignConversationId = route.params?.assignConversationId

    const imgSrc = useColorModeValue(imgLightSrc, imgDarkSrc)

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
        <ImageBackground source={imgSrc} resizeMode="cover">
          <View w="full" py={spacing.small}>
            <Stack space={1} px={spacing.tiny} rounded="md" alignItems="center">
              <Icon colorToken={"text.softer"} size={32} icon="userPlus" />
              <Text
                textAlign={"center"}
                fontWeight="bold"
                fontSize="2xl"
                tx={"contacts.addContactHeader"}
              ></Text>
              <Text
                textAlign={"center"}
                colorToken="text.soft"
                tx={"contacts.addContactSubheader"}
              ></Text>
            </Stack>
          </View>
        </ImageBackground>
        <Stack space={spacing.extraSmall} py={spacing.tiny} px={spacing.tiny}>
          <AddContactForm ref={formRef} phone={paramPhone} onSubmit={handleOnSubmitAddContact} />
          <Button
            isLoading={isLoadingCreate}
            colorScheme={"primary"}
            onPress={handleOnSave}
            tx="contacts.addContactAction"
          ></Button>
          <Text textAlign={"center"} preset="legal" colorToken="text.softer" tx="legal.contact" />
        </Stack>
      </Screen>
    )
  },
)
