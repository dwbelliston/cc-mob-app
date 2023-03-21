import { HStack } from "native-base"
import { IHStackProps } from "native-base/lib/typescript/components/primitives/Stack/HStack"
import useReadUserProfile from "../services/api/userprofile/queries/useReadUserProfile"

import { spacing } from "../theme"
import { runFormatPhoneSimple } from "../utils/useFormatPhone"
import { Dot } from "./Dot"
import { Text, TextProps } from "./Text"

interface IProps extends IHStackProps {
  textProps?: TextProps
}
export const UserPhone = (props: IProps) => {
  const { textProps, ...rest } = props

  const { data: userProfile, isLoading: isLoadingProfile } = useReadUserProfile()

  return (
    <HStack px={spacing.micro} space={2} alignItems="center" {...rest}>
      {userProfile?.IsPhoneRegistered ? <Dot.Success></Dot.Success> : <Dot.Warning></Dot.Warning>}
      <Text
        fontSize="lg"
        maxFontSizeMultiplier={1}
        colorToken={"text.soft"}
        colorScheme={"gray"}
        fontWeight="semibold"
        {...textProps}
      >
        {runFormatPhoneSimple(userProfile?.RegisteredNumber.PhoneNumber)}
      </Text>
    </HStack>
  )
}
