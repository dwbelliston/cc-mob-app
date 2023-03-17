/*
SelectTemplateButton
*/

import * as Haptics from "expo-haptics"
import { Box, Divider, HStack, Pressable, Stack, useColorModeValue, View } from "native-base"
import React from "react"

import { BottomSheetFlatList, BottomSheetModal } from "@gorhom/bottom-sheet"
import { Keyboard } from "react-native"
import { Icon, IconButton, IconButtonProps, Text } from "../../components"
import { ISmsTemplate } from "../../models/SmsTemplate"
import useListSmsTemplates from "../../services/api/smstemplates/queries/useListSmsTemplates"
import { colors, spacing } from "../../theme"
import { useColor } from "../../theme/useColor"

export interface ISelectTemplateButtonProps extends IconButtonProps {
  onTemplateSelect: (template: ISmsTemplate) => void
}

export const SelectTemplateButton = ({ onTemplateSelect, ...rest }: ISelectTemplateButtonProps) => {
  const [flatData, setFlatData] = React.useState<ISmsTemplate[]>()

  const bottomSheetModalRef = React.useRef<BottomSheetModal>(null)

  const { data: dataTemplates, isLoading: isLoadingTemplates } = useListSmsTemplates()

  const bgColor = useColor("bg.main")
  const borderColor = useColorModeValue(colors.gray[200], colors.gray[700])

  const snapPoints = React.useMemo(() => ["25%", "50%", "80%"], [])

  const handleOnOpenSelect = () => {
    Keyboard.dismiss()
    Haptics.selectionAsync()
    bottomSheetModalRef.current?.present()
  }

  const handleSelected = (smsTemplate: ISmsTemplate) => {
    Haptics.selectionAsync()
    bottomSheetModalRef.current?.close()
    onTemplateSelect(smsTemplate)
  }

  const renderItem = React.useCallback(
    ({ item }: { item: ISmsTemplate }) => (
      <Pressable onPress={() => handleSelected(item)} px={spacing.tiny}>
        <Stack
          flex={1}
          bg={bgColor}
          borderColor={borderColor}
          borderWidth={1}
          rounded="lg"
          py={spacing.tiny}
          px={spacing.micro}
          space={2}
        >
          <HStack space={2} alignItems="center">
            <Text flex={1} fontWeight={"semibold"} fontSize="sm">
              {item.Title}
            </Text>
          </HStack>
          <Text fontSize="xs">{item.Message}</Text>
        </Stack>
      </Pressable>
    ),
    [bgColor, borderColor],
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
          backgroundColor: bgColor,
        }}
        handleIndicatorStyle={{
          backgroundColor: borderColor,
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: bgColor,
          }}
        >
          <Box
            pb={spacing.micro}
            px={spacing.tiny}
            borderBottomWidth={1}
            borderBottomColor={borderColor}
          >
            <Text
              preset="heading"
              textAlign={"center"}
              fontSize="xl"
              tx="templates.smstemplates"
            ></Text>
          </Box>

          <BottomSheetFlatList
            data={flatData}
            style={{
              paddingTop: spacing.small,
              paddingBottom: 0,
            }}
            keyExtractor={(i) => i.SmsTemplateId}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <Divider my={spacing.micro} bg="transparent" />}
          />
        </View>
      </BottomSheetModal>
    </>
  )
}
