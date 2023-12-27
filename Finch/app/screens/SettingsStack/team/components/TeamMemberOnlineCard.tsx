import { Avatar, HStack, Stack } from "native-base"

import React from "react"
import { Text } from "../../../../components"
import { Badge } from "../../../../components/Badge"
import { ITeamMember } from "../../../../models/TeamMember"
import { useColor } from "../../../../theme/useColor"
import { getInitials } from "../../../../utils/getInitials"

export interface ITeamMemberOnlineProps extends ITeamMember {
  IsOnline: boolean
}

interface ITeamMemberOnlineCardProps {
  viewerAvatar: ITeamMemberOnlineProps
}

export const TeamMemberOnlineCard = ({ viewerAvatar }: ITeamMemberOnlineCardProps) => {
  const teamMemberName = viewerAvatar?.FirstName
    ? `${viewerAvatar.FirstName} ${viewerAvatar.LastName}`
    : viewerAvatar.Email

  const initials = getInitials(teamMemberName)

  const borderColor = useColor("text.softest")

  const badgeColor = viewerAvatar?.IsJoined
    ? viewerAvatar.IsOnline
      ? "success"
      : "error"
    : "amber"

  return (
    <HStack
      space={4}
      px={4}
      py={4}
      justifyContent="space-between"
      borderWidth={1}
      rounded="lg"
      borderColor={borderColor}
      alignItems={"center"}
    >
      <HStack space={4}>
        <Avatar
          _light={{
            bg: "gray.100",
            _text: {
              color: "gray.500",
            },
          }}
          _dark={{
            bg: "gray.700",
            _text: {
              color: "gray.200",
            },
          }}
          source={{ uri: viewerAvatar.BrandImageUrl }}
          size="md"
        >
          {initials}
          <Avatar.Badge bg={`${badgeColor}.500`} />
        </Avatar>
        <Stack space={0} flex={1}>
          <HStack space={4} alignItems={"center"} flex={1} flexWrap="wrap">
            {viewerAvatar.FirstName ? (
              <Text
                noOfLines={1}
                fontSize="lg"
              >{`${viewerAvatar.FirstName} ${viewerAvatar.LastName}`}</Text>
            ) : null}
            {viewerAvatar?.IsAdmin ? (
              <Badge text={{ fontSize: "xs", tx: "common.admin" }} colorScheme={"gray"} />
            ) : null}
            {viewerAvatar?.IsInvited && !viewerAvatar.IsJoined ? (
              <Badge text={{ fontSize: "xs", tx: "common.invited" }} colorScheme={"gray"} />
            ) : null}

            {viewerAvatar.IsJoined && !viewerAvatar.IsActive ? (
              <Text
                colorToken="error.soft"
                fontSize="sm"
                fontWeight={"semibold"}
                tx="common.inactive"
              ></Text>
            ) : null}
          </HStack>

          <Text w="full" flex={1} noOfLines={1} isTruncated={true} colorToken="text.soft">
            {viewerAvatar.Email}
          </Text>
        </Stack>
      </HStack>
    </HStack>
  )
}
