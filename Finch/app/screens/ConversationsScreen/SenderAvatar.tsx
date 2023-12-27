import { IAvatarProps } from "native-base"
import React from "react"
import { ContactAvatar } from "../../components/ContactAvatar"
import { CurrentClientAvatar } from "../../components/CurrentClientAvatar"
import useReadContact from "../../services/api/contacts/queries/useReadContact"
import { TeamMemberAvatar } from "./TeamMemberAvatar"

interface IProps extends IAvatarProps {
  isRobotMessage?: boolean
  isUserMessage?: boolean
  senderMemberId?: string
  senderName?: string
  contactId?: string
  contactName?: string
  contactInitials?: string
  contactColor?: string
}

export const SenderAvatar = ({
  isRobotMessage,
  isUserMessage,
  senderMemberId,
  senderName,
  contactId,
  contactName,
  contactInitials,
  contactColor,
  ...rest
}: IProps) => {
  const { data: dataContact } = useReadContact(contactId)

  if (isUserMessage) {
    return (
      <>
        {isRobotMessage ? (
          <CurrentClientAvatar size="sm" />
        ) : (
          <TeamMemberAvatar
            senderMemberId={senderMemberId}
            senderName={senderName}
            size="sm"
            {...rest}
          ></TeamMemberAvatar>
        )}
      </>
    )
  }

  return (
    <ContactAvatar
      // innerRingColor={"red.400"}
      avatarColor={contactColor}
      contactId={contactId}
      initials={contactInitials}
      avatarProps={{ size: "sm" }}
    ></ContactAvatar>
  )
}
