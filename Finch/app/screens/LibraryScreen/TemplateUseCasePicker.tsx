import { observer } from "mobx-react-lite"
import { HStack, IconButton, Menu, Stack } from "native-base"
import React from "react"
import { Icon, Text } from "../../components"
import { useStores } from "../../models"
import { spacing } from "../../theme"

import { StyleProp, ViewStyle } from "react-native"
import { Dot } from "../../components/Dot"
import { translate } from "../../i18n"
import { useColor } from "../../theme/useColor"

export interface TemplateUseCasePickerProps {
  /**
   * An optional style override useful for padding & margin.
   */

  style?: StyleProp<ViewStyle>
}

export const TemplateUseCasePicker = observer(function TemplateUseCasePicker(
  props: TemplateUseCasePickerProps,
) {
  const { libraryStore } = useStores()

  const txtColor = useColor("text.softer")

  const handleOnSetUsecase = (filterTo: string) => {
    libraryStore.setUseCaseFilter(filterTo)
  }

  return (
    <Stack position="relative">
      <Menu
        w="56"
        trigger={(triggerProps) => {
          return (
            <IconButton
              size="sm"
              variant={"ghost"}
              colorScheme={"gray"}
              _text={{
                color: txtColor,
              }}
              accessibilityLabel="Select use case filter"
              icon={<Icon icon="funnel"></Icon>}
              {...triggerProps}
            ></IconButton>
          )
        }}
      >
        <Menu.Group
          title={translate("library.selectUsecase")}
          _title={{
            textTransform: "none",
            _light: {
              color: txtColor,
            },
            _dark: {
              color: txtColor,
            },
            textAlign: "center",
          }}
        >
          {libraryStore?.useCases?.map((useCaseOption) => {
            return (
              <Menu.Item key={useCaseOption} onPress={() => handleOnSetUsecase(useCaseOption)}>
                <HStack space={spacing.micro} alignItems="center">
                  {libraryStore.useCaseFilter === useCaseOption ? (
                    <Dot.Success size="md" />
                  ) : (
                    <Dot.Neutral size="md" />
                  )}
                  <Text flex={1} colorToken={"text"} text={useCaseOption}></Text>
                </HStack>
              </Menu.Item>
            )
          })}
        </Menu.Group>
      </Menu>
    </Stack>
  )
})
