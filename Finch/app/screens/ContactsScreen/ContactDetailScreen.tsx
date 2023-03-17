import * as Haptics from "expo-haptics"
import { observer } from "mobx-react-lite"
import { Stack, useColorModeValue } from "native-base"
import React, { FC } from "react"

import { Screen } from "../../components"
import { getContactName } from "../../models/Contact"
import useReadContact from "../../services/api/contacts/queries/useReadContact"
import { colors, spacing } from "../../theme"
import { useColor } from "../../theme/useColor"
import { runFormatPhone } from "../../utils/useFormatPhone"

import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { LabelValuePill } from "../../components/LabelValuePill"
import { ITag } from "../../models/Tag"
import { AppStackScreenProps } from "../../navigators"
import useListTags from "../../services/api/tags/queries/useListTags"
import { runFormatDate } from "../../utils/useFormatDate"
import { DynamicContactActions } from "./DynamicContactActions"
import { DynamicContactHeader } from "./DynamicContactHeader"

export const ContactDetailScreen: FC<AppStackScreenProps<"ContactDetail">> = observer(
  function ContactDetailScreen(_props) {
    const { navigation, route } = _props

    const scrollY = useSharedValue(0)

    const scrollHandler = useAnimatedScrollHandler({
      onScroll: (e) => {
        scrollY.value = e.contentOffset.y
      },
    })

    const statusBarColor = "light"

    const [contactName, setContactName] = React.useState("")
    const [contactNumber, setContactNumber] = React.useState("")

    const bgColor = useColorModeValue(colors.primary[600], colors.primary[600])
    const bgMain = useColor("bg.main")

    const { top: topInset } = useSafeAreaInsets()

    const {
      data: dataContact,
      isLoading: isLoadingContact,
      isError: isErrorContact,
    } = useReadContact(route.params.contactId)

    const [contactsTags, setContactsTags] = React.useState<ITag[]>([])

    const { data: tagList } = useListTags()

    const handleOnBack = () => {
      Haptics.selectionAsync()
      navigation.goBack()
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
            bgColor={bgColor}
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
                    isShare={false}
                  />
                  <LabelValuePill.Text
                    label="fieldLabels.phone"
                    icon="phone"
                    text={contactNumber}
                  />
                  <LabelValuePill.Text
                    label="fieldLabels.email"
                    icon="envelope"
                    text={dataContact?.Email}
                  />
                  <LabelValuePill.Text
                    label="fieldLabels.birthdate"
                    icon="cake"
                    text={runFormatDate(dataContact?.BirthDate)}
                    isShare={false}
                  />
                  <LabelValuePill.Address
                    label="fieldLabels.address"
                    icon="mapPin"
                    address1={dataContact?.Address1}
                    address2={dataContact?.Address2}
                    city={dataContact?.City}
                    state={dataContact?.State}
                    zip={dataContact?.Zip}
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
      </Screen>
    )
  },
)
