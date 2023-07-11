import { useNavigation } from "@react-navigation/native"
import { HStack, Pressable, View } from "native-base"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Text } from "../components"
import { Badge } from "../components/Badge"
import {
  useIsAccountInactive,
  useIsAccountTrial,
  useSubscriptionEndsFromNow,
} from "../models/UserProfile"
import useReadUserProfile from "../services/api/userprofile/queries/useReadUserProfile"

export const AccountStatusBanner = (props: any) => {
  const { data: userProfile } = useReadUserProfile()

  const navigation = useNavigation<any>()

  const isHasInactiveAccount = useIsAccountInactive(userProfile)
  const isHasTrialAccount = useIsAccountTrial(userProfile)
  const subscriptionEndsFromNow = useSubscriptionEndsFromNow(userProfile)

  const { top } = useSafeAreaInsets()

  const handleOnPress = () => {
    navigation.navigate("SettingsStack")
    navigation.push("MySubscription")
  }

  if (isHasTrialAccount) {
    return (
      <View bg="primary.700" style={{ paddingTop: top }} px={4} py={4}>
        <Pressable onPress={handleOnPress}>
          <HStack space={4} justifyContent={"center"} alignItems={"center"}>
            <Badge
              text={{ fontSize: "xs", fontWeight: "semibold", tx: "common.trial" }}
              colorScheme={"amber"}
            />
            <Text text={`Trial ends ${subscriptionEndsFromNow}`} color={"primary.100"}></Text>
          </HStack>
        </Pressable>
      </View>
    )
  }

  if (isHasInactiveAccount) {
    return (
      <View bg="red.700" style={{ paddingTop: top }} px={4} py={4}>
        <Pressable onPress={handleOnPress}>
          <HStack space={4} justifyContent={"center"} alignItems={"center"}>
            <Badge
              text={{ fontSize: "xs", fontWeight: "semibold", tx: "common.inactive" }}
              colorScheme={"red"}
            />
            <Text text={"Please renew plan"} color={"red.100"}></Text>
          </HStack>
        </Pressable>
      </View>
    )
  }

  return null
}
