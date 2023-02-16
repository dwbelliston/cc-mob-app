import { Avatar, Box, Center, HStack, Stack } from "native-base"
import React from "react"
import { Text } from "../../components"
import { CallDirectionEnum, CallStatusEnum } from "../../models/Call"
import { IConversation } from "../../models/Conversation"
import { MessageDirectionEnum } from "../../models/Message"
import { runFormatPhoneSimple } from "../../utils/useFormatPhone"

const CARDTYPES = {
  inbound: {
    variant: "solid",
    colorScheme: "rose",
    display: "incoming",
  },
  dispatch: {
    variant: "subtle",
    colorScheme: "primary",
    display: "dispatch",
  },
  broadcast: {
    variant: "subtle",
    colorScheme: "indigo",
    display: "broadcast",
  },
  conversation: {
    variant: "subtle",
    colorScheme: "gray",
    display: "responded",
  },
}

interface IProps {
  conversation: IConversation
  onClickConversation: (conversationId: string) => void
  isSelected: boolean
  isShowSelectBox: boolean
  onToggleSelected: () => void
}
export const ConversationCard = (props: IProps) => {
  const [isActive, set_isActive] = React.useState(false)

  const [cardType, set_cardType] = React.useState<string>("conversation")
  const [isUserMessage, set_isUserMessage] = React.useState<boolean>(false)
  const [contactNumber, set_contactNumber] = React.useState<string>()
  const [createdTime, set_createdTime] = React.useState<string>()

  const handleOnClickConversation = () => {
    props.onClickConversation(props.conversation.ConversationId)
  }

  const handleOnToggleSelected = (evt) => {
    evt.stopPropagation()
    props.onToggleSelected()
  }

  console.log("ConversationCard", ConversationCard)

  React.useEffect(() => {
    // Has message
    if (props.conversation?.LatestMessage) {
      set_contactNumber(props.conversation.LatestMessage.ContactNumber)
      set_createdTime(props.conversation.LatestMessage.CreatedTime)

      if (props.conversation.LatestMessage?.Meta.Type) {
        try {
          set_cardType(props.conversation.LatestMessage.Meta.Type)
        } catch (e) {}
      }

      if (props.conversation.LatestMessage?.Direction) {
        set_isUserMessage(props.conversation.LatestMessage.Direction === MessageDirectionEnum.SENT)
      }
    }

    // Has call
    if (props.conversation?.LatestCall) {
      set_contactNumber(props.conversation.LatestCall.ContactNumber)
      set_createdTime(props.conversation.LatestCall.CreatedTime)

      if (props.conversation.LatestCall?.Direction) {
        if (props.conversation.LatestCall.Direction === CallDirectionEnum.OUTBOUND) {
          set_isUserMessage(true)
          set_cardType("outbound-call")
        } else {
          if (
            [CallStatusEnum.NOANSWER, CallStatusEnum.BUSY].includes(
              props.conversation.LatestCall.Status,
            )
          ) {
            set_cardType("inbound-call-missed")
          } else {
            set_cardType("inbound-call-done")
          }
        }
      }
    }
  }, [props.conversation])

  return (
    <Box px={4}>
      <Box
        shadow="sm"
        rounded="lg"
        borderWidth="1px"
        borderColor="gray.200"
        w="full"
        // my={0.5}
        py={2}
        px={4}
        position="relative"
        // _groupHover={{
        //   bg: props.isSelected
        //     ? isActive
        //       ? "indigo.200"
        //       : "indigo.100"
        //     : isActive
        //     ? "blue.100"
        //     : "gray.100",
        // }}
        // onPress={handleOnClickConversation}
        bg={
          props.isSelected
            ? isActive
              ? "indigo.200"
              : "indigo.50"
            : isActive
            ? "blue.50"
            : "white"
        }
        // transition="all 0.2s"
      >
        <HStack w="full" minH="24" alignItems="center" space={4}>
          <Center
            w={14}
            h={14}
            // onClick={handleOnToggleSelected}
          >
            {/* <Box
              display={props.isShowSelectBox ? "block" : "none"}
              _groupHover={{
                display: "block",
              }}
            >
              <IndeterminateCheckbox
                checked={props.isSelected}
                readOnly
              ></IndeterminateCheckbox>
            </Box> */}
            <Avatar
              display={props.isShowSelectBox ? "none" : "block"}
              // _groupHover={{
              //   display: "none",
              // }}
              // name={props.conversation.ContactName}
              borderWidth="1px"
              borderColor={"gray.200"}
              bg={"gray.100"}
              color={"gray.400"}
              position={"relative"}
            >
              {/* {cardType === "dispatch" && (
                <AvatarBadge
                  boxSize="1.5em"
                  borderWidth={"2px"}
                  // bg="primary.50"
                  bg="white"
                  bottom={"-2.5em"}
                  borderColor="gray.200"
                >
                  <Icon
                    fontSize=".8em"
                    color="primary.600"
                    as={FlagIconSolid}
                  />
                </AvatarBadge>
              )}
              {cardType === "broadcast" && (
                <AvatarBadge
                  boxSize="1.5em"
                  borderWidth={"2px"}
                  // bg="indigo.50"
                  bg="white"
                  bottom={"-2.5em"}
                  borderColor="gray.200"
                >
                  <Icon
                    fontSize=".8em"
                    color="indigo.600"
                    as={MegaphoneIconSolid}
                  />
                </AvatarBadge>
              )}
              {cardType === "conversation" && (
                <AvatarBadge
                  boxSize="1.5em"
                  borderWidth={"2px"}
                  // bg="gray.50"
                  bg="white"
                  bottom={"-2.5em"}
                  borderColor="gray.200"
                >
                  <Icon
                    fontSize=".8em"
                    color="gray.600"
                    as={ArrowUturnLeftIcon}
                  />
                </AvatarBadge>
              )}
              {cardType === "inbound" && (
                <AvatarBadge
                  boxSize="1.5em"
                  borderWidth={"2px"}
                  // bg="rose.100"
                  bg="white"
                  bottom={"-2.5em"}
                  borderColor="rose.500"
                >
                  <Icon
                    fontSize=".8em"
                    color="rose.600"
                    as={ChatBubbleLeftEllipsisIcon}
                  />
                </AvatarBadge>
              )}
              {cardType === "inbound-call-missed" && (
                <AvatarBadge
                  boxSize="1.5em"
                  borderWidth={"2px"}
                  // bg="rose.100"
                  bg="white"
                  bottom={"-2.5em"}
                  borderColor="rose.500"
                >
                  <Icon
                    fontSize=".8em"
                    color="rose.600"
                    as={PhoneArrowDownLeftIcon}
                  />
                </AvatarBadge>
              )}
              {cardType === "inbound-call-done" && (
                <AvatarBadge
                  boxSize="1.5em"
                  borderWidth={"2px"}
                  // bg="gray.50"
                  bg="white"
                  bottom={"-2.5em"}
                  borderColor="gray.200"
                >
                  <Icon
                    fontSize=".8em"
                    color="gray.600"
                    as={PhoneArrowDownLeftIcon}
                  />
                </AvatarBadge>
              )}
              {cardType === "outbound-call" && (
                <AvatarBadge
                  boxSize="1.5em"
                  borderWidth={"2px"}
                  // bg="gray.50"
                  bg="white"
                  bottom={"-2.5em"}
                  borderColor="gray.200"
                >
                  <Icon
                    fontSize=".8em"
                    color="gray.600"
                    as={PhoneArrowUpRightIcon}
                  />
                </AvatarBadge>
              )} */}
            </Avatar>
          </Center>
          <Stack space={2} flex={1}>
            <Stack space={0}>
              <HStack justifyContent={"space-between"} space={0}>
                <Text
                  fontSize="lg"
                  noOfLines={1}
                  fontWeight="semibold"
                  // wordBreak={"break-all"}
                  flex={1}
                  text={
                    props.conversation.ContactName
                      ? props.conversation.ContactName
                      : runFormatPhoneSimple(contactNumber)
                  }
                ></Text>
                {/* {createdTime && (
                  <Text fontSize="sm" color="gray.500" whiteSpace={"nowrap"}>
                    {runFormatTimeFromNowSpecial(createdTime)}
                  </Text>
                )} */}
                {}
              </HStack>
            </Stack>

            {/* <HStack>
              {conversationFolderDisplay && (
                <Badge
                  fontSize="sm"
                  maxW={32}
                  variant="subtle"
                  colorScheme={"gray"}
                  isTruncated={true}
                >
                  <HStack space={2} alignItems="center">
                    <Icon as={FolderIcon}></Icon>
                    <Text>{conversationFolderDisplay.Title}</Text>
                  </HStack>
                </Badge>
              )}
            </HStack> */}
          </Stack>
        </HStack>
      </Box>
    </Box>
  )
}
