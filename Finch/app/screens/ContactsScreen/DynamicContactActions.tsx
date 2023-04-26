import { useNavigation } from "@react-navigation/native"
import * as Haptics from "expo-haptics"
import * as Linking from "expo-linking"
import { HStack, Button as NBButton, Skeleton, View } from "native-base"
import React from "react"
import Animated, { SharedValue, interpolateColor, useAnimatedStyle } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Icon, IconButton } from "../../components"
import { OpenEmailButton } from "../../components/OpenEmailButton"
import { OpenMapButton } from "../../components/OpenMapButton"
import { getContactAddress, getContactName } from "../../models/Contact"
import { getConversationId } from "../../models/Conversation"
import { useUserPhone } from "../../models/UserProfile"
import useReadContact from "../../services/api/contacts/queries/useReadContact"
import useReadUserProfile from "../../services/api/userprofile/queries/useReadUserProfile"
import { spacing } from "../../theme"
import { useColor } from "../../theme/useColor"
import { useCustomToast } from "../../utils/useCustomToast"

interface IProps {
  scrollY: SharedValue<number>
  bgColor: string
  contactId: string
}

export const DynamicContactActions = ({ scrollY, bgColor, contactId }: IProps) => {
  const textColor = useColor("text.light")
  const toast = useCustomToast()

  const navigation = useNavigation<any>()
  const { top: topInset } = useSafeAreaInsets()

  const bgMain = useColor("bg.main")
  const bgHigher = useColor("bg.higher")

  const animateStartOffset = 50

  const { data: dataContact, isLoading: isLoadingContact } = useReadContact(contactId)
  const { data: userProfile } = useReadUserProfile()

  const userNumber = useUserPhone(userProfile)

  const addressLine = getContactAddress(dataContact)

  const animatedBorderStyles = useAnimatedStyle(() => {
    const bColor = interpolateColor(
      scrollY.value,
      [animateStartOffset, animateStartOffset + 100],
      [bgMain, bgHigher],
    )

    return {
      borderBottomColor: bColor,
    }
  })

  const handleOnCallPress = () => {
    Haptics.selectionAsync()
    if (dataContact) {
      Linking.openURL(`tel:${dataContact.Phone}`)
    }
  }

  const handleViewConversation = () => {
    Haptics.selectionAsync()
    const contactName = getContactName(dataContact)

    const conversationId = getConversationId(userNumber, dataContact?.Phone)

    navigation.navigate("ConversationStream", {
      contactName,
      conversationId,
      contactId,
      conversationNumber: dataContact?.Phone,
    })
  }

  return (
    <Animated.View
      style={[
        {
          flex: 1,
          backgroundColor: bgColor,
          borderBottomWidth: 1,
        },
        [animatedBorderStyles],
      ]}
    >
      <View
        roundedTopLeft="sm"
        roundedTopRight="sm"
        backgroundColor={bgMain}
        pb={spacing.extraSmall}
        style={[
          {
            // keep it from getting close to notches
            paddingTop: topInset + spacing.extraSmall,
          },
        ]}
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
              onPress={handleOnCallPress}
              rounded="full"
              icon={<Icon colorToken="text" icon="phoneArrowUpRight" />}
            />
            <IconButton
              rounded="full"
              onPress={handleViewConversation}
              icon={<Icon colorToken="text" icon="chatBubbleLeftEllipsis" />}
            />
            <OpenEmailButton rounded="full" email={dataContact?.Email} />
            <OpenMapButton
              rounded="full"
              text={addressLine}
              icon={<Icon colorToken="text" icon="mapPin" />}
            />
            {/* <IconButton
              rounded="full"
              icon={<Icon colorToken="text" icon="ellipsisHorizontal" />}
            /> */}
          </NBButton.Group>
        )}
      </View>
    </Animated.View>
  )
}
