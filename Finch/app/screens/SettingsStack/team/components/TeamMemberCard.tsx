import { Avatar, HStack, Stack } from "native-base"

import React from "react"
import { Text } from "../../../../components"
import { Badge } from "../../../../components/Badge"
import { ITeamMember } from "../../../../models/TeamMember"
import { useColor } from "../../../../theme/useColor"
import { getInitials } from "../../../../utils/getInitials"

interface ITeamMemberCardProps {
  teamMember: ITeamMember
}

export const TeamMemberCard = ({ teamMember }: ITeamMemberCardProps) => {
  const teamMemberName = teamMember?.FirstName
    ? `${teamMember.FirstName} ${teamMember.LastName}`
    : teamMember.Email

  const initials = getInitials(teamMemberName)

  const borderColor = useColor("text.softest")

  const badgeColor = teamMember?.IsJoined ? (teamMember.IsActive ? "success" : "error") : "amber"

  return (
    <HStack
      space={4}
      px={6}
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
          source={{ uri: teamMember.BrandImageUrl }}
          size="md"
        >
          {initials}
          <Avatar.Badge bg={`${badgeColor}.500`} />
        </Avatar>
        <Stack space={0} flex={1}>
          <HStack space={4} alignItems={"center"} flex={1} flexWrap="wrap">
            {teamMember.FirstName ? (
              <Text
                noOfLines={1}
                fontSize="lg"
              >{`${teamMember.FirstName} ${teamMember.LastName}`}</Text>
            ) : null}
            {teamMember?.IsAdmin ? (
              <Badge text={{ fontSize: "xs", tx: "common.admin" }} colorScheme={"gray"} />
            ) : null}
            {teamMember?.IsInvited && !teamMember.IsJoined ? (
              <Badge text={{ fontSize: "xs", tx: "common.invited" }} colorScheme={"gray"} />
            ) : null}

            {teamMember.IsJoined && !teamMember.IsActive ? (
              <Text
                colorToken="error.soft"
                fontSize="sm"
                fontWeight={"semibold"}
                tx="common.inactive"
              ></Text>
            ) : null}
          </HStack>

          <Text w="full" flex={1} noOfLines={1} isTruncated={true} colorToken="text.soft">
            {teamMember.Email}
          </Text>
        </Stack>
      </HStack>
    </HStack>
  )
}
