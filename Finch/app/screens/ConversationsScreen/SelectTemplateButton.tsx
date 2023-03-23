/*
SelectTemplateButton
*/

import * as Haptics from "expo-haptics"
import { Box, Divider, HStack, Pressable, Stack, useColorModeValue, View } from "native-base"
import React from "react"

import { BottomSheetFlatList, BottomSheetModal } from "@gorhom/bottom-sheet"
import { Keyboard } from "react-native"
import { useSharedValue } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Icon, IconButton, IconButtonProps, Text } from "../../components"
import { AnimatedBackground } from "../../components/AnimatedBackground"
import { DataStatus } from "../../components/DataStatus"
import { translate } from "../../i18n"
import { ISmsTemplate } from "../../models/SmsTemplate"
import useListSmsTemplates from "../../services/api/smstemplates/queries/useListSmsTemplates"
import { colors, spacing } from "../../theme"
import { useColor } from "../../theme/useColor"

export interface ISelectTemplateButtonProps extends IconButtonProps {
  onTemplateSelect: (template: ISmsTemplate) => void
}

const TemplateOptionPressable = ({
  template,
  onPress,
}: {
  template: ISmsTemplate
  onPress: () => void
}) => {
  const progress = useSharedValue(0)

  const handleOnPress = () => {
    progress.value = 1
    onPress()
  }

  return (
    <Pressable onPress={handleOnPress} px={spacing.tiny}>
      <AnimatedBackground
        sharedValue={progress}
        bgStart="bg.high"
        bgEnd={"bg.higher"}
        styles={{ borderRadius: 12 }}
      >
        <Stack flex={1} rounded="lg" py={spacing.tiny} px={spacing.tiny} space={2}>
          <HStack space={2} alignItems="center">
            <Text flex={1} fontWeight={"semibold"} fontSize="sm">
              {template.Title}
            </Text>
          </HStack>
          <Text fontSize="xs">{template.Message}</Text>
        </Stack>
      </AnimatedBackground>
    </Pressable>
  )
}

export const SelectTemplateButton = ({ onTemplateSelect, ...rest }: ISelectTemplateButtonProps) => {
  const [flatData, setFlatData] = React.useState<ISmsTemplate[]>()

  const bottomSheetModalRef = React.useRef<BottomSheetModal>(null)
  const { top: topInset, bottom: bottomInset } = useSafeAreaInsets()

  const { data: dataTemplates, isLoading: isLoadingTemplates } = useListSmsTemplates()

  const bgHighColor = useColor("bg.high")
  const bgColor = useColor("bg.main")
  const borderColor = useColorModeValue(colors.gray[200], colors.gray[700])

  const snapPoints = React.useMemo(() => ["25%", "50%", "80%"], [])

  const handleOnOpenSelect = () => {
    Keyboard.dismiss()
    Haptics.selectionAsync()
    bottomSheetModalRef.current?.present()
  }

  const handleSelected = React.useCallback(
    (smsTemplate: ISmsTemplate) => {
      Haptics.selectionAsync()
      onTemplateSelect(smsTemplate)
      bottomSheetModalRef.current?.close()
    },
    [onTemplateSelect],
  )

  const renderItem = React.useCallback(
    ({ item }: { item: ISmsTemplate }) => (
      <TemplateOptionPressable
        key={item.SmsTemplateId}
        template={item}
        onPress={() => {
          handleSelected(item)
        }}
      ></TemplateOptionPressable>
    ),
    [bgColor, borderColor, handleSelected],
  )

  React.useEffect(() => {
    if (dataTemplates) {
      const flatDataUpdate: ISmsTemplate[] = dataTemplates.records.flatMap(
        (template, idx) => template,
      )

      setFlatData(flatDataUpdate)
    }
  }, [dataTemplates])

  return (
    <>
      <IconButton
        onPress={handleOnOpenSelect}
        rounded="full"
        size="sm"
        icon={<Icon colorToken={"text"} icon="clipboardDocumentCheck" size={16} />}
        {...rest}
      ></IconButton>

      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={1}
        snapPoints={snapPoints}
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
        <View
          style={{
            flex: 1,
            backgroundColor: bgColor,
          }}
        >
          <Box
            pb={spacing.tiny}
            px={spacing.tiny}
            borderBottomWidth={1}
            borderBottomColor={borderColor}
            bg={bgHighColor}
          >
            <Text
              preset="heading"
              textAlign={"center"}
              fontSize="xl"
              tx="smsTemplates.templates"
            ></Text>
          </Box>

          <BottomSheetFlatList
            data={flatData}
            style={{
              paddingTop: spacing.small,
            }}
            contentContainerStyle={{
              paddingBottom: bottomInset,
            }}
            ListEmptyComponent={
              isLoadingTemplates ? (
                <Box px={spacing.tiny} py={spacing.small} h="full">
                  <Text textAlign={"center"} colorToken="text.softer" tx="common.oneMoment"></Text>
                </Box>
              ) : (
                <Box px={spacing.tiny} py={spacing.small} h="full">
                  <DataStatus
                    title={translate("smsTemplates.noTemplates")}
                    description={translate("smsTemplates.noTemplatesDescription")}
                    icon={"clipboardDocumentCheck"}
                    colorScheme={"gray"}
                  />
                </Box>
              )
            }
            keyExtractor={(i) => i.SmsTemplateId}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <Divider py={spacing.micro} bg="transparent" />}
          />
        </View>
      </BottomSheetModal>
    </>
  )
}
