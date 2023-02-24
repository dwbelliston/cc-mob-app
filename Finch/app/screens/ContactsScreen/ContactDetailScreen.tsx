import { observer } from "mobx-react-lite"
import { Box, Button as NBButton, HStack, Spinner, Stack, View } from "native-base"
import React, { FC } from "react"

import { Button, Icon, IconButton, Screen, Text } from "../../components"
import { ContactAvatar } from "../../components/ContactAvatar"
import { getContactName } from "../../models/Contact"
import useReadContact from "../../services/api/contacts/queries/useReadContact"
import { getAvatarColor, spacing } from "../../theme"
import { useColor } from "../../theme/useColor"
import { getInitials } from "../../utils/getInitials"
import { runFormatPhone } from "../../utils/useFormatPhone"
import { ContactsStackScreenProps } from "./ContactsStack"

const imgSrc = require("../../../assets/images/img-lines-header-light.png")

import { ImageBackground, Linking, Platform } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { IconValuePill } from "../../components/IconValuePill"
import { Phone } from "../../components/Phone"

export const ContactDetailScreen: FC<ContactsStackScreenProps<"ContactDetail">> = observer(
  function ContactDetailScreen(_props) {
    const { navigation, route } = _props

    const [contactInitials, setContactInitials] = React.useState("")
    const [contactName, setContactName] = React.useState("")
    const [contactNumber, setContactNumber] = React.useState("")
    const [contactColor, setContactColor] = React.useState("")
    const [viewPane, setViewPane] = React.useState(false)

    const statusBarColor = "light"

    const bgMain = useColor("bg.main")
    const bgHeader = useColor("bg.accent")
    const bgColor = useColor("bg.higher")
    const lightText = useColor("text.light")

    const { top: topInset } = useSafeAreaInsets()

    const {
      data: dataContact,
      isLoading: isLoadingContact,
      isError: isErrorContact,
    } = useReadContact(route.params.contactId)

    const handleOnBack = () => {
      navigation.goBack()
    }

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

    React.useEffect(() => {
      if (dataContact) {
        const contactName = getContactName(dataContact)
        const intitials = getInitials(contactName)
        const avatarColor = getAvatarColor(contactName)

        setContactColor(avatarColor)
        setContactInitials(intitials)
        setContactName(contactName)
        setContactNumber(runFormatPhone(dataContact.Phone))
      }
    }, [dataContact])

    return (
      <Screen
        preset="scroll"
        safeAreaEdges={[]}
        statusBarStyle={statusBarColor}
        contentContainerStyle={{
          paddingBottom: 0,
          paddingTop: 0,
        }}
      >
        <View h="full">
          {/* Contact Header */}
          <Box bg={contactColor}>
            <ImageBackground source={imgSrc} resizeMode="cover">
              <Stack
                style={{
                  paddingTop: topInset,
                }}
                space={spacing.extraSmall}
                px={spacing.tiny}
                pb={spacing.medium}
              >
                <HStack justifyContent={"space-between"} alignItems="center">
                  <Box>
                    <Button
                      onPress={handleOnBack}
                      variant="solid"
                      leftIcon={<Icon size={20} icon="arrowLeftLong" />}
                      size="sm"
                      tx="common.back"
                    ></Button>
                  </Box>
                  <ContactAvatar
                    outerRingColor={"transparent"}
                    innerRingColor={"transparent"}
                    avatarColor={lightText}
                    avatarProps={{ size: "md" }}
                    contactSource={dataContact?.SourceType}
                  ></ContactAvatar>
                </HStack>

                {isLoadingContact && (
                  <Box py={spacing.tiny}>
                    <Spinner size="lg"></Spinner>
                  </Box>
                )}

                {dataContact && (
                  <Stack>
                    <Text
                      colorToken={"text.light"}
                      fontSize="3xl"
                      preset="subheading"
                      text={contactName}
                    ></Text>
                    <Text colorToken={"text.light"} fontSize="md" text={contactNumber}></Text>

                    <Phone.Type
                      colorToken={"text.light"}
                      fontSize="sm"
                      numberCarrierType={dataContact?.NumberCarrierType}
                    />
                  </Stack>
                )}
              </Stack>
            </ImageBackground>
          </Box>

          {/* Contact details, pulled up */}
          <Box
            bg={bgMain}
            roundedTopLeft="2xl"
            roundedTopRight="2xl"
            mt={-spacing.tiny}
            pt={spacing.extraSmall}
            px={spacing.tiny}
          >
            {!isLoadingContact && dataContact && (
              <Stack space={spacing.small}>
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

                <Stack space={spacing.tiny}>
                  <Text preset="subheading" tx="contact.information"></Text>
                  <Stack space={4}>
                    <IconValuePill icon="phone" text={contactNumber} />
                    <IconValuePill icon="envelope" text={dataContact?.Email} />
                    <IconValuePill icon="cake" text={dataContact?.BirthDate} />
                  </Stack>
                </Stack>

                <Phone.Pill
                  phone={dataContact?.Phone}
                  numberCarrierType={dataContact?.NumberCarrierType}
                  numberCarrierName={dataContact?.NumberCarrierName}
                />

                <Stack space={spacing.tiny}>
                  <Stack space={spacing.tiny}>
                    <Text preset="subheading" tx="contact.address"></Text>

                    <Stack space={1}>
                      <IconValuePill icon="mapPin" text={dataContact?.Address1} />
                      <IconValuePill icon="mapPin" text={dataContact?.Address2} />
                      <IconValuePill icon="mapPin" text={dataContact?.City} />
                      <IconValuePill icon="mapPin" text={dataContact?.State} />
                      <IconValuePill icon="mapPin" text={dataContact?.Zip} />
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
            )}
          </Box>
        </View>
      </Screen>
    )
  },
)
