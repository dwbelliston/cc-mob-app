import { Center, HStack, Skeleton, Stack } from "native-base"
import { ImageBackground } from "react-native"
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated"
import { Icon, IconButton, Text } from "../../components"
import { ContactSourceAvatar } from "../../components/ContactSourceAvatar"
import { Phone } from "../../components/Phone"
import { spacing } from "../../theme"
import { useColor } from "../../theme/useColor"

const imgSrc = require("../../../assets/images/img-lines-header-light.png")

export const DynamicContactHeader = ({
  scrollY,
  contactColor,
  topInset,
  handleOnBack,
  dataContact,
  isLoadingContact,
  contactName,
  contactNumber,
}) => {
  const textColor = useColor("text.light")

  const animateStartOffset = 100

  const animatedFontStyles = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [0, animateStartOffset], [1, 0.25], {
      extrapolateLeft: Extrapolation.CLAMP,
      extrapolateRight: Extrapolation.CLAMP,
    })

    return {
      opacity: withSpring(opacity, {
        overshootClamping: true,
      }),
    }
  })

  return (
    <Animated.View
      style={[
        {
          flex: 1,
          backgroundColor: contactColor,
          // minHeight: 280,
        },
      ]}
    >
      <ImageBackground
        style={{
          paddingTop: topInset,
        }}
        source={imgSrc}
        resizeMode="cover"
      >
        <Stack
          h="full"
          pt={spacing.tiny}
          pb={spacing.small}
          space={spacing.extraSmall}
          px={spacing.tiny}
        >
          <HStack justifyContent={"space-between"}>
            <Center>
              <IconButton
                size="xs"
                onPress={handleOnBack}
                rounded="full"
                icon={<Icon size={20} colorToken="text" icon="arrowLeftLong" />}
              />
            </Center>

            <ContactSourceAvatar size="sm" contactSource={dataContact?.SourceType} />
          </HStack>

          {isLoadingContact && (
            <Stack space={spacing.tiny} py={spacing.tiny}>
              <Skeleton h="8" w="70%" rounded="sm" />
              <Skeleton h="6" w="20%" rounded="sm" />
            </Stack>
          )}

          {dataContact && (
            <Stack space={spacing.micro}>
              <Animated.Text
                style={[
                  { fontSize: 30, color: textColor, fontWeight: "bold" },
                  [animatedFontStyles],
                ]}
              >
                {contactName}
              </Animated.Text>

              <Stack>
                <Text colorToken={"text.light"}>{contactNumber}</Text>

                <Phone.Type
                  colorToken={"text.light"}
                  fontSize="sm"
                  numberCarrierType={dataContact?.NumberCarrierType}
                />
              </Stack>
            </Stack>
          )}
        </Stack>
      </ImageBackground>
    </Animated.View>
  )
}
