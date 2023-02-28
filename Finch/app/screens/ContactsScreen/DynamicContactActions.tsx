import { Button as NBButton, HStack, Skeleton, View } from "native-base"
import Animated, { interpolateColor, useAnimatedStyle } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Icon, IconButton } from "../../components"
import useReadContact from "../../services/api/contacts/queries/useReadContact"
import { spacing } from "../../theme"
import { useColor } from "../../theme/useColor"

export const DynamicContactActions = ({ scrollY, contactColor, contactId }) => {
  const textColor = useColor("text.light")

  const { top: topInset } = useSafeAreaInsets()

  const bgMain = useColor("bg.main")
  const bgHigher = useColor("bg.higher")

  const animateStartOffset = 50

  const { data: dataContact, isLoading: isLoadingContact } = useReadContact(contactId)

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

  return (
    <Animated.View
      style={[
        {
          flex: 1,
          backgroundColor: contactColor,
          borderBottomWidth: 3,
        },
        [animatedBorderStyles],
      ]}
    >
      <View
        roundedTopLeft="2xl"
        roundedTopRight="2xl"
        backgroundColor={bgMain}
        pb={spacing.extraSmall}
        style={[
          {
            // keep it from getting close to notches
            paddingTop: topInset,
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
            <IconButton rounded="full" icon={<Icon colorToken="text" icon="phoneArrowUpRight" />} />
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
      </View>
    </Animated.View>
  )
}
