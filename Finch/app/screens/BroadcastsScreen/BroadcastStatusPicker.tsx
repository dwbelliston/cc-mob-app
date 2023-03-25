import { observer } from "mobx-react-lite"
import { HStack, IconButton, Menu, Stack } from "native-base"
import React from "react"
import { Icon, Text } from "../../components"
import { useStores } from "../../models"
import { spacing } from "../../theme"

import { StyleProp, ViewStyle } from "react-native"
import { Dot } from "../../components/Dot"
import { translate } from "../../i18n"
import { BroadcastStatusEnum } from "../../models/Broadcast"
import { useColor } from "../../theme/useColor"

export interface BroadcastStatusPickerProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

export const BroadcastStatusPicker = observer(function BroadcastStatusPicker(
  props: BroadcastStatusPickerProps,
) {
  const { broadcastsStore } = useStores()

  const txtColor = useColor("text.softer")

  const handleOnActive = () => {
    broadcastsStore.setListView(BroadcastStatusEnum.ACTIVE)
  }
  const handleOnCompleted = () => {
    broadcastsStore.setListView(BroadcastStatusEnum.COMPLETED)
  }
  const handleOnDraft = () => {
    broadcastsStore.setListView(BroadcastStatusEnum.DRAFT)
  }
  const handleOnArchived = () => {
    broadcastsStore.setListView(BroadcastStatusEnum.ARCHIVED)
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
              accessibilityLabel="Select inbox filter"
              icon={<Icon icon="funnel"></Icon>}
              {...triggerProps}
            ></IconButton>
          )
        }}
      >
        <Menu.Group
          title={translate("broadcasts.selectStatus")}
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
          <Menu.Item onPress={handleOnDraft}>
            <HStack space={spacing.micro} alignItems="center">
              <Dot.Info size="sm" />
              <Text flex={1} colorToken={"text"} tx="broadcasts.draft"></Text>
              <Icon size={20} colorToken={"text.softer"} icon="pencil"></Icon>
            </HStack>
          </Menu.Item>
          <Menu.Item onPress={handleOnActive}>
            <HStack space={spacing.micro} alignItems="center">
              <Dot.Success size="sm" />
              <Text flex={1} colorToken={"text"} tx="broadcasts.active"></Text>
              <Icon size={20} colorToken={"text.softer"} icon="play"></Icon>
            </HStack>
          </Menu.Item>
          <Menu.Item onPress={handleOnCompleted}>
            <HStack space={spacing.micro} alignItems="center">
              <Dot.Neutral size="sm" />
              <Text flex={1} colorToken={"text"} tx="broadcasts.completed"></Text>
              <Icon size={20} colorToken={"text.softer"} icon="checkCircle"></Icon>
            </HStack>
          </Menu.Item>
          <Menu.Item onPress={handleOnArchived}>
            <HStack space={spacing.micro} alignItems="center">
              <Dot.Error size="sm" />
              <Text flex={1} colorToken={"text"} tx="broadcasts.archived"></Text>
              <Icon size={20} colorToken={"text.softer"} icon="archiveBox"></Icon>
            </HStack>
          </Menu.Item>
        </Menu.Group>
      </Menu>
    </Stack>
  )
})
