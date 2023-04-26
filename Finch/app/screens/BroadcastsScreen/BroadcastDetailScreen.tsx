import * as Haptics from "expo-haptics"
import { observer } from "mobx-react-lite"
import { Box, HStack, Stack, useColorModeValue, View } from "native-base"
import React, { FC } from "react"

import { Button, Screen, Text } from "../../components"
import { colors, spacing } from "../../theme"
import { useColor } from "../../theme/useColor"

import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet"
import { gestureHandlerRootHOC } from "react-native-gesture-handler"
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { LabelStatPill } from "../../components/LabelStatPill"
import { LabelValuePill } from "../../components/LabelValuePill"
import { translate } from "../../i18n"
import { IBroadcastUpdate } from "../../models/Broadcast"
import { AppStackScreenProps } from "../../navigators"
import useUpdateBroadcast from "../../services/api/broadcasts/mutations/useUpdateBroadcast"
import { useReadBroadcast } from "../../services/api/broadcasts/queries/useReadBroadcast"
import useListTags from "../../services/api/tags/queries/useListTags"
import { useCustomToast } from "../../utils/useCustomToast"
import { DynamicBroadcastHeader } from "./DynamicBroadcastHeader"
// import { EditContactAddressForm } from "./EditContactAddressForm"
// import { EditContactEmailForm } from "./EditContactEmailForm"
// import { EditContactNameForm } from "./EditContactNameForm"
// import { EditContactPhoneForm } from "./EditContactPhoneForm"

enum EditFormModeEnum {
  EDIT_NAME = "EDIT_NAME",
  EDIT_PHONE = "EDIT_PHONE",
  EDIT_EMAIL = "EDIT_EMAIL",
  EDIT_ADDRESS = "EDIT_ADDRESS",
}

export type FormHandle = {
  submitForm: () => void
}

const BroadcastDetailScreenBase: FC<AppStackScreenProps<"BroadcastDetail">> = observer(
  function BroadcastDetailScreen(_props) {
    const { navigation, route } = _props

    const [editMode, setEditMode] = React.useState<EditFormModeEnum>()
    const bottomSheetModalRef = React.useRef<BottomSheetModal>(null)
    const formRef = React.useRef<FormHandle>(null)

    const statusBarColor = "light"
    const scrollY = useSharedValue(0)

    const scrollHandler = useAnimatedScrollHandler({
      onScroll: (e) => {
        scrollY.value = e.contentOffset.y
      },
    })

    const { top: topInset, bottom: bottomInset } = useSafeAreaInsets()
    const toast = useCustomToast()
    const bgColor = useColorModeValue(colors.primary[600], colors.primary[600])
    const borderColor = useColor("text.softest")
    const bgHighColor = useColor("bg.high")
    const bgMain = useColor("bg.main")

    const snapPoints = React.useMemo(() => ["50%", "80%", "100%"], [])

    const {
      data: dataBroadcast,
      isLoading: isLoadingBroadcast,
      isError: isErrorBroadcast,
    } = useReadBroadcast(route.params.broadcastId)

    const { mutateAsync: mutateAsyncUpdate, isLoading: isLoadingUpdate } = useUpdateBroadcast()

    const { data: tagList } = useListTags()

    const handleOnUpdate = async (data: IBroadcastUpdate) => {
      try {
        await mutateAsyncUpdate({ broadcastId: route.params.broadcastId, updates: data })

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

    return (
      <>
        <Screen preset="fixed" statusBarStyle={statusBarColor}>
          <Animated.ScrollView
            scrollEventThrottle={0}
            onScroll={scrollHandler}
            // stickyHeaderIndices={[0]}
          >
            <DynamicBroadcastHeader
              handleOnBack={handleOnBack}
              topInset={topInset}
              scrollY={scrollY}
              isLoadingBroadcast={isLoadingBroadcast}
              dataBroadcast={dataBroadcast}
              bgColor={bgColor}
            />

            {/* Content */}
            <View backgroundColor={bgColor}>
              <Stack
                roundedTopLeft="sm"
                roundedTopRight="sm"
                px={spacing.tiny}
                bg={bgMain}
                flex={1}
                pt={spacing.small}
                pb={spacing.small}
              >
                {!isLoadingBroadcast && dataBroadcast && (
                  <Stack space={spacing.small}>
                    <Stack space={spacing.extraSmall}>
                      <LabelStatPill.Number
                        label="broadcasts.statSendComplete"
                        icon={{ icon: "checkCircle", colorToken: "success" }}
                        number={dataBroadcast?.StatSendComplete}
                      />
                      <LabelStatPill.Number
                        label="broadcasts.statSendError"
                        icon={{ icon: "noSymbol", colorToken: "error" }}
                        number={dataBroadcast?.StatSendError + dataBroadcast.StatSendNonMobile}
                      />
                      <LabelValuePill.Message
                        label="fieldLabels.message"
                        icon="chatBubbleLeftEllipsis"
                        messageBody={dataBroadcast?.MessageBody}
                        messageMediaItems={dataBroadcast?.MessageMediaItems}
                      />
                    </Stack>
                  </Stack>
                )}
              </Stack>
            </View>
          </Animated.ScrollView>
        </Screen>
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
          android_keyboardInputMode="adjustResize"
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
              backgroundColor: bgMain,
            }}
          >
            {/* {editMode === EditFormModeEnum.EDIT_NAME ? (
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
            ) : null} */}
          </BottomSheetScrollView>
        </BottomSheetModal>
      </>
    )
  },
)

export const BroadcastDetailScreen = gestureHandlerRootHOC(BroadcastDetailScreenBase)
