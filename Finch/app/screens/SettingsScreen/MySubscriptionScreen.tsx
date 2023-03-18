import { observer } from "mobx-react-lite"
import { Box, Spinner, Stack } from "native-base"
import React, { FC } from "react"

import { Screen, Text } from "../../components"
import { LabelValuePill } from "../../components/LabelValuePill"
import useReadUserProfile from "../../services/api/userprofile/queries/useReadUserProfile"
import { spacing } from "../../theme"

import * as WebBrowser from "expo-web-browser"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { PressableActionRow } from "../../components/PressableActionRow"
import { translate } from "../../i18n"
import { useCreatePortalSession } from "../../services/api/userprofile/mutations/useCreatePortalSession"
import { useCustomToast } from "../../utils/useCustomToast"
import { runFormatTimeWithAt } from "../../utils/useFormatDate"
import { SettingsStackScreenProps } from "./SettingsStack"

export const MySubscriptionScreen: FC<SettingsStackScreenProps<"MySubscription">> = observer(
  function MySubscriptionScreen(_props) {
    const { bottom: bottomInset } = useSafeAreaInsets()
    const toast = useCustomToast()

    const { data: userProfile, isLoading: isLoadingProfile } = useReadUserProfile()

    const { mutateAsync: mutateAsyncPortal } = useCreatePortalSession()

    const createPortalSession = async () => {
      const res = await mutateAsyncPortal(null)

      if (res) {
        WebBrowser.openBrowserAsync(res)
      } else {
        toast.warning({ title: translate("billing.failedToOpen") })
      }
    }

    return (
      <Screen
        preset="scroll"
        contentContainerStyle={{
          paddingBottom: bottomInset + spacing.large,
        }}
        style={{}}
      >
        <Box py={spacing.extraSmall}>
          {isLoadingProfile ? (
            <Spinner></Spinner>
          ) : (
            <Stack space={spacing.extraSmall}>
              <Stack px={spacing.tiny}>
                <Text fontSize="lg" preset="subheading" tx="billing.pageHeader"></Text>
                <Text colorToken="text.softer" fontSize="md" tx="billing.pageSubheader"></Text>
              </Stack>
              <Stack>
                <PressableActionRow
                  tx="billing.changePayment"
                  icon={{
                    icon: "creditCard",
                  }}
                  onPress={createPortalSession}
                ></PressableActionRow>
                <PressableActionRow
                  tx="billing.editSubscription"
                  icon={{
                    icon: "pencilSquare",
                  }}
                  onPress={createPortalSession}
                ></PressableActionRow>
              </Stack>
              <Stack space={spacing.extraSmall} px={spacing.tiny}>
                <LabelValuePill.Text
                  label="billing.billingType"
                  icon="creditCard"
                  text={userProfile?.Billing.BillingType}
                />
                <LabelValuePill.Text
                  label="billing.productName"
                  icon="cube"
                  text={userProfile?.Billing.ProductName}
                />
                <LabelValuePill.Text
                  label="billing.productDescription"
                  icon="cube"
                  text={userProfile?.Billing.ProductDescription}
                />
                <LabelValuePill.Text
                  label="billing.createdAt"
                  icon="clock"
                  text={runFormatTimeWithAt(userProfile?.Billing.CreatedTime)}
                />
                <LabelValuePill.Text
                  label="billing.currentBillingIntervalStart"
                  icon="clock"
                  text={runFormatTimeWithAt(userProfile?.Billing.CurrentPeriodStartTime)}
                />
                <LabelValuePill.Text
                  label="billing.currentBillingIntervalEnd"
                  icon="clock"
                  text={runFormatTimeWithAt(userProfile?.Billing.CurrentPeriodEndTime)}
                />
                <LabelValuePill.Text
                  label="billing.subscriptionStatus"
                  icon="checkCircle"
                  text={userProfile?.Billing?.SubscriptionStatus}
                />
                {!userProfile?.Billing?.CancelAtTime ? (
                  <LabelValuePill.Text
                    label="billing.willCancelAt"
                    icon="clock"
                    text={runFormatTimeWithAt(userProfile?.Billing.CancelAtTime)}
                  />
                ) : null}
                {!userProfile?.Billing?.CanceledAtTime ? (
                  <LabelValuePill.Text
                    label="billing.canceledAt"
                    icon="clock"
                    text={runFormatTimeWithAt(userProfile?.Billing.CanceledAtTime)}
                  />
                ) : null}
              </Stack>
            </Stack>
          )}
        </Box>
      </Screen>
    )
  },
)
