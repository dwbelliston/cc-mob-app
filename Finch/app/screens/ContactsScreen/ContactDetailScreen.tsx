import * as Haptics from "expo-haptics"
import { observer } from "mobx-react-lite"
import { Box, HStack, Stack, useColorModeValue } from "native-base"
import React, { FC } from "react"

import { Button, Screen, Text } from "../../components"
import { getContactName, IContactUpdate } from "../../models/Contact"
import useReadContact from "../../services/api/contacts/queries/useReadContact"
import { colors, spacing } from "../../theme"
import { useColor } from "../../theme/useColor"
import { runFormatPhone } from "../../utils/useFormatPhone"

import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet"
import { gestureHandlerRootHOC } from "react-native-gesture-handler"
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { LabelValuePill } from "../../components/LabelValuePill"
import { translate } from "../../i18n"
import { ITag } from "../../models/Tag"
import { AppStackScreenProps } from "../../navigators"
import useUpdateContact from "../../services/api/contacts/mutations/useUpdateContact"
import useListTags from "../../services/api/tags/queries/useListTags"
import { useCustomToast } from "../../utils/useCustomToast"
import { runFormatDate } from "../../utils/useFormatDate"
import { DynamicContactActions } from "./DynamicContactActions"
import { DynamicContactHeader } from "./DynamicContactHeader"
import { EditContactAddressForm } from "./EditContactAddressForm"
import { EditContactEmailForm } from "./EditContactEmailForm"
import { EditContactNameForm } from "./EditContactNameForm"
import { EditContactPhoneForm } from "./EditContactPhoneForm"

enum EditFormModeEnum {
  EDIT_NAME = "EDIT_NAME",
  EDIT_PHONE = "EDIT_PHONE",
  EDIT_EMAIL = "EDIT_EMAIL",
  EDIT_ADDRESS = "EDIT_ADDRESS",
}

export type FormHandle = {
  submitForm: () => void
}

const ContactDetailScreenBase: FC<AppStackScreenProps<"ContactDetail">> = observer(
  function ContactDetailScreen(_props) {
    const { navigation, route } = _props

    const [editMode, setEditMode] = React.useState<EditFormModeEnum>()
    const bottomSheetModalRef = React.useRef<BottomSheetModal>(null)
    const formRef = React.useRef<FormHandle>(null)

    const scrollY = useSharedValue(0)

    const scrollHandler = useAnimatedScrollHandler({
      onScroll: (e) => {
        scrollY.value = e.contentOffset.y
      },
    })

    const statusBarColor = "light"

    const [contactName, setContactName] = React.useState("")
    const [contactNumber, setContactNumber] = React.useState("")

    const { top: topInset, bottom: bottomInset } = useSafeAreaInsets()
    const toast = useCustomToast()
    const bgColor = useColorModeValue(colors.primary[600], colors.primary[600])
    const borderColor = useColor("text.softest")
    const bgHighColor = useColor("bg.high")
    const bgMain = useColor("bg.main")

    const snapPoints = React.useMemo(() => ["50%", "80%", "100%"], [])

    const {
      data: dataContact,
      isLoading: isLoadingContact,
      isError: isErrorContact,
    } = useReadContact(route.params.contactId)

    const { mutateAsync: mutateAsyncUpdate, isLoading: isLoadingUpdate } = useUpdateContact()

    const [contactsTags, setContactsTags] = React.useState<ITag[]>([])

    const { data: tagList } = useListTags()

    const handleOnUpdate = async (data: IContactUpdate) => {
      try {
        await mutateAsyncUpdate({ contactId: route.params.contactId, updateData: data })

        toast.success({ title: translate("common.saved") })
        handleOnCancel()
      } catch (e) {
        toast.error({ title: "Error saving" })
      }
    }

    const handleOnCancel = () => {
      setEditMode(undefined)
      bottomSheetModalRef.current?.dismiss()
    }

    const handleOnBack = () => {
      Haptics.selectionAsync()
      navigation.goBack()
    }

    const handleOnSave = () => {
      formRef.current.submitForm()
    }

    const handleOnEditName = () => {
      setEditMode(EditFormModeEnum.EDIT_NAME)
      bottomSheetModalRef.current?.present()
    }

    const handleOnEditPhone = () => {
      setEditMode(EditFormModeEnum.EDIT_PHONE)
      bottomSheetModalRef.current?.present()
    }
    const handleOnEditEmail = () => {
      setEditMode(EditFormModeEnum.EDIT_EMAIL)
      bottomSheetModalRef.current?.present()
    }
    const handleOnEditAddress = () => {
      setEditMode(EditFormModeEnum.EDIT_ADDRESS)
      bottomSheetModalRef.current?.present()
    }

    React.useEffect(() => {
      if (dataContact) {
        const contactName = getContactName(dataContact)

        setContactName(contactName)
        setContactNumber(runFormatPhone(dataContact.Phone))
      }
    }, [dataContact])

    React.useEffect(() => {
      let activeTags: ITag[] = []

      if (dataContact && dataContact.Tags && tagList && tagList.records.length) {
        // TODO: move this to reuse
        // Reduce contact tags to only active tags, map color and title
        activeTags = dataContact.Tags.reduce<ITag[]>((memo: any, contactTagId) => {
          const foundTag = tagList.records.find((listTag) => listTag.TagId === contactTagId)

          if (foundTag) {
            // what happens inside the filter is the map
            memo.push(foundTag)
          }
          return memo
        }, [])
      }

      setContactsTags(activeTags)
    }, [tagList, dataContact, setContactsTags])

    return (
      <Screen preset="fixed" safeAreaEdges={[]} statusBarStyle={statusBarColor}>
        <Animated.ScrollView
          scrollEventThrottle={0}
          onScroll={scrollHandler}
          stickyHeaderIndices={[1]}
        >
          <DynamicContactHeader
            handleOnBack={handleOnBack}
            topInset={topInset}
            scrollY={scrollY}
            isLoadingContact={isLoadingContact}
            dataContact={dataContact}
            bgColor={bgColor}
            contactName={contactName}
            contactNumber={contactNumber}
          />

          <DynamicContactActions
            scrollY={scrollY}
            bgColor={borderColor}
            contactId={route.params.contactId}
          />

          {/* Content */}
          <Stack px={spacing.tiny} bg={bgMain} flex={1} pt={spacing.tiny} pb={spacing.small}>
            {!isLoadingContact && dataContact && (
              <Stack space={spacing.small}>
                <Stack space={spacing.extraSmall}>
                  <LabelValuePill.Tags label="fieldLabels.tags" icon="tag" tags={contactsTags} />
                  <LabelValuePill.Text
                    label="fieldLabels.name"
                    icon="userCircle"
                    text={contactName}
                    onEdit={handleOnEditName}
                  />

                  <LabelValuePill.PhoneType
                    label="fieldLabels.phone"
                    icon="phone"
                    phone={contactNumber}
                    carrierName={dataContact.NumberCarrierName}
                    carrierType={dataContact.NumberCarrierType}
                    isCopy={true}
                    onEdit={handleOnEditPhone}
                  />
                  <LabelValuePill.Text
                    label="fieldLabels.email"
                    icon="envelope"
                    text={dataContact?.Email}
                    isShare={true}
                    onEdit={handleOnEditEmail}
                  />
                  <LabelValuePill.Text
                    label="fieldLabels.birthdate"
                    icon="cake"
                    text={runFormatDate(dataContact?.BirthDate)}
                  />
                  <LabelValuePill.Address
                    label="fieldLabels.address"
                    icon="mapPin"
                    address1={dataContact?.Address1}
                    address2={dataContact?.Address2}
                    city={dataContact?.City}
                    state={dataContact?.State}
                    zip={dataContact?.Zip}
                    isOpen={true}
                    isShare={true}
                    onEdit={handleOnEditAddress}
                  />
                  <LabelValuePill.ContactSource
                    label="fieldLabels.sourceType"
                    icon="cloudArrowDown"
                    contactSource={dataContact.SourceType}
                  />
                </Stack>
              </Stack>
            )}
          </Stack>
        </Animated.ScrollView>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={0}
          snapPoints={snapPoints}
          topInset={topInset}
          style={{
            borderTopWidth: 1,
            borderTopColor: borderColor,
          }}
          handleStyle={{
            backgroundColor: bgHighColor,
          }}
          handleIndicatorStyle={{
            backgroundColor: borderColor,
          }}
        >
          <Box
            pb={spacing.tiny}
            px={spacing.tiny}
            borderBottomWidth={1}
            borderBottomColor={borderColor}
            bg={bgHighColor}
          >
            <HStack justifyContent={"space-between"}>
              <Box flex={1}>
                <Button onPress={handleOnCancel} size="xs" tx="common.cancel"></Button>
              </Box>

              <Text
                flex={3}
                preset="heading"
                textAlign={"center"}
                fontSize="xl"
                tx="common.edit"
              ></Text>

              <Box flex={1}>
                <Button
                  isLoading={isLoadingUpdate}
                  onPress={handleOnSave}
                  size="xs"
                  colorScheme={"primary"}
                  tx="common.save"
                ></Button>
              </Box>
            </HStack>
          </Box>
          <BottomSheetScrollView
            style={{
              flex: 1,
              backgroundColor: bgMain,
            }}
          >
            {editMode === EditFormModeEnum.EDIT_NAME ? (
              <EditContactNameForm ref={formRef} data={dataContact} onSubmit={handleOnUpdate} />
            ) : null}
            {editMode === EditFormModeEnum.EDIT_PHONE ? (
              <EditContactPhoneForm ref={formRef} data={dataContact} onSubmit={handleOnUpdate} />
            ) : null}
            {editMode === EditFormModeEnum.EDIT_EMAIL ? (
              <EditContactEmailForm ref={formRef} data={dataContact} onSubmit={handleOnUpdate} />
            ) : null}
            {editMode === EditFormModeEnum.EDIT_ADDRESS ? (
              <EditContactAddressForm ref={formRef} data={dataContact} onSubmit={handleOnUpdate} />
            ) : null}
          </BottomSheetScrollView>
        </BottomSheetModal>
      </Screen>
    )
  },
)

export const ContactDetailScreen = gestureHandlerRootHOC(ContactDetailScreenBase)
