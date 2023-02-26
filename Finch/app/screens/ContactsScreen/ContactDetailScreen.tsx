import * as Haptics from "expo-haptics"
import { observer } from "mobx-react-lite"
import { Box, Button as NBButton, HStack, Skeleton, Stack } from "native-base"
import React, { FC } from "react"

import { Icon, IconButton, Screen } from "../../components"
import { getContactName } from "../../models/Contact"
import useReadContact from "../../services/api/contacts/queries/useReadContact"
import { spacing } from "../../theme"
import { useColor } from "../../theme/useColor"
import { runFormatPhone } from "../../utils/useFormatPhone"
import { ContactsStackScreenProps } from "./ContactsStack"

import { Linking, Platform } from "react-native"

import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { IconValuePill } from "../../components/IconValuePill"
import { DynamicContactHeader } from "./DynamicContactHeader"

export const ContactDetailScreen: FC<ContactsStackScreenProps<"ContactDetail">> = observer(
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
    const [contactColor] = React.useState(route.params.contactColor)

    const bgMain = useColor("bg.main")

    const { top: topInset } = useSafeAreaInsets()

    const {
      data: dataContact,
      isLoading: isLoadingContact,
      isError: isErrorContact,
    } = useReadContact(route.params.contactId)

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

    // variables
    const openMap = async (address, city, zipCode) => {
      const destination = encodeURIComponent(`${address} ${zipCode}, ${city}`)
      const provider = Platform.OS === "ios" ? "apple" : "google"
      const link = `http://maps.${provider}.com/?address=${address}`

      try {
        const supported = await Linking.canOpenURL(link)

        if (supported) Linking.openURL(link)
      } catch (error) {
        console.log(error)
      }
    }

    return (
      <Screen preset="fixed" safeAreaEdges={[]} statusBarStyle={statusBarColor}>
        <Animated.ScrollView
          scrollEventThrottle={1}
          onScroll={scrollHandler}
          stickyHeaderIndices={[1]}
        >
          {/* Header */}
          <DynamicContactHeader
            handleOnBack={handleOnBack}
            topInset={topInset}
            scrollY={scrollY}
            isLoadingContact={isLoadingContact}
            dataContact={dataContact}
            contactColor={contactColor}
            contactName={contactName}
            contactNumber={contactNumber}
          />

          {/* Actions */}
          <Box bg={contactColor}>
            <Box
              bg={bgMain}
              roundedTopLeft="2xl"
              roundedTopRight="2xl"
              style={{
                // keep it from getting close to notches
                paddingTop: topInset,
              }}
              pb={spacing.extraSmall}
            >
              {isLoadingContact && (
                <HStack flex={1} space={spacing.tiny} justifyContent="center">
                  <Skeleton h={12} w={12} rounded="full" />
                  <Skeleton h={12} w={12} rounded="full" />
                  <Skeleton h={12} w={12} rounded="full" />
                  <Skeleton h={12} w={12} rounded="full" />
                </HStack>
              )}

              {!isLoadingContact && dataContact && (
                <NBButton.Group size="lg" justifyContent={"center"} space={spacing.tiny}>
                  <IconButton
                    rounded="full"
                    icon={<Icon colorToken="text" icon="phoneArrowUpRight" />}
                  />
                  <IconButton
                    rounded="full"
                    icon={<Icon colorToken="text" icon="chatBubbleLeftEllipsis" />}
                  />
                  <IconButton rounded="full" icon={<Icon colorToken="text" icon="envelope" />} />
                  <IconButton
                    rounded="full"
                    icon={<Icon colorToken="text" icon="ellipsisHorizontal" />}
                  />
                </NBButton.Group>
              )}
            </Box>
          </Box>

          {/* Content */}
          <Stack px={spacing.tiny} bg={bgMain} flex={1} pt={spacing.tiny} pb={spacing.small}>
            {!isLoadingContact && dataContact && (
              <Stack space={spacing.small}>
                <Stack space={spacing.extraSmall}>
                  <IconValuePill label="fieldLabels.name" icon="phone" text={contactName} />
                  <IconValuePill label="fieldLabels.phone" icon="phone" text={contactNumber} />
                  <IconValuePill
                    label="fieldLabels.email"
                    icon="envelope"
                    text={dataContact?.Email}
                  />
                  <IconValuePill
                    label="fieldLabels.birthdate"
                    icon="cake"
                    text={dataContact?.BirthDate}
                  />
                  <IconValuePill
                    label="fieldLabels.address"
                    icon="cake"
                    text={dataContact?.Address1}
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
