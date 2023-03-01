// /*
// ConversationMessage
// */

import { Box, HStack, Stack, View } from "native-base"
import React from "react"
import { Text } from "../../components"
import { ContactAvatar } from "../../components/ContactAvatar"
import { UserAvatar } from "../../components/UserAvatar"
import { IMessage, MessageDirectionEnum } from "../../models/Message"
import useReadUserProfile from "../../services/api/userprofile/queries/useReadUserProfile"
import { spacing } from "../../theme"
import { getInitials } from "../../utils/getInitials"
import { runFormatMinuteTime } from "../../utils/useFormatDate"
import TextMessageBubble from "./TextMessageBubble"

interface IProps {
  message: IMessage
  contactName: string
}

const ConversationMessage = ({ message, contactName }: IProps) => {
  const { data: userProfile } = useReadUserProfile()

  const [isUserMessage, set_isUserMessage] = React.useState(
    message.Direction === MessageDirectionEnum.SENT,
  )

  const initials = getInitials(contactName)

  return (
    <View w="full">
      <HStack
        space={spacing.micro}
        direction={isUserMessage ? "row-reverse" : "row"}
        alignItems="flex-end"
      >
        {/* Gutter */}
        <Box>
          {isUserMessage ? (
            <UserAvatar isShowLoading={false} size="sm"></UserAvatar>
          ) : (
            <ContactAvatar
              // innerRingColor={cardBg}
              // avatarColor={avatarColor}
              initials={initials}
              avatarProps={{ size: "sm" }}
              // contactSource={contactSourceType}
              // onPress={handleOnClickContactAvatar}
            ></ContactAvatar>
          )}
        </Box>
        {/* Body */}
        <Stack
          flex={1}
          maxW={"80%"}
          space={1}
          alignItems={isUserMessage ? "flex-end" : "flex-start"}
        >
          <HStack flex={1}>
            <TextMessageBubble isUserMessage={isUserMessage} message={message.Message} />
          </HStack>

          <Text colorToken={"text.softer"} text={runFormatMinuteTime(message.CreatedTime)}></Text>
        </Stack>
      </HStack>
    </View>
  )
}
//   const [messageDispatchId, set_messageDispatchId] = React.useState<
//     string | null
//   >(null);
//   const [messageCampaignId, set_messageCampaignId] = React.useState<
//     string | null
//   >(null);
//   const [messageBroadcastId, set_messageBroadcastId] = React.useState<
//     string | null
//   >(null);
//   const [messageType, set_messageType] = React.useState<string | null>(null);

//   );
//   const [isMessageError, set_isMessageError] = React.useState<boolean>(false);
//   const [isMessageDelivered, set_isMessageDelivered] =
//     React.useState<boolean>(false);
//   const [isMessageBlocked, set_isMessageBlocked] =
//     React.useState<boolean>(false);
//   const [isMessageSending, set_isMessageSending] =
//     React.useState<boolean>(false);
//   const { userProfile } = useAuth();

//   const handleViewCampaign = () => {
//     navigate(
//       `/app/relays/campaigns/${messageCampaignId}/dispatches/${messageDispatchId}`
//     );
//   };

//   const handleViewBroadcast = () => {
//     navigate(`/app/relays/broadcasts/${messageBroadcastId}/contacts`);
//   };

//   React.useEffect(() => {
//     set_messageDispatchId(getMessageDispatchId(message));
//     set_messageBroadcastId(getMessageBroadcastId(message));
//     set_messageCampaignId(getMessageCampaignId(message));
//     set_messageType(getMessageType(message));

//     set_isMessageError(getIsMessageError(message));
//     set_isMessageDelivered(getIsMessageDelivered(message));
//     set_isMessageBlocked(getIsMessageBlocked(message));
//     set_isMessageSending(getIsMessageSending(message));

//     set_isUserMessage(message.Direction === MessageDirectionEnum.SENT);
//   }, [message]);

//   return (
//     <>
//       <Stack
//         spacing={2}
//         alignItems="flex-start"
//         direction={isUserMessage ? "row-reverse" : "row"}
//       >
//         {/* Gutter */}
//         <HStack mt={1}>
//           {isUserMessage ? (
//             <Avatar
//               src={`${userProfile?.BrandImageUrl}`}
//               name={`${userProfile.FirstName} ${userProfile.LastName}`}
//               size="md"
//             ></Avatar>
//           ) : (
//             <Avatar name={contactName} size="md"></Avatar>
//           )}
//           {isMessageError && (
//             <Tooltip label={message.Status}>
//               <Box color="white">
//                 <Icon
//                   h="6"
//                   w="6"
//                   as={ExclamationCircleIcon}
//                   color="red.700"
//                 ></Icon>
//               </Box>
//             </Tooltip>
//           )}
//           {isMessageBlocked && (
//             <Tooltip label={message.Status}>
//               <Box color="white">
//                 <Icon h="6" w="6" as={NoSymbolIcon} color="red.700"></Icon>
//               </Box>
//             </Tooltip>
//           )}
//           {isMessageSending && (
//             <Tooltip label={"sending"}>
//               <Box color="white">
//                 <Icon
//                   h="6"
//                   w="6"
//                   as={PaperAirplaneIcon}
//                   color="blue.400"
//                   style={{
//                     animation: "pulse 2s infinite linear",
//                   }}
//                 ></Icon>
//               </Box>
//             </Tooltip>
//           )}
//         </HStack>

//         {/* Container */}
//         <Stack
//           alignItems={isUserMessage ? "flex-end" : "flex-start"}
//           spacing={2}
//         >
//           {/* Media */}
//           {message.MessageMediaItems && (
//             <MessageMediaItemsPreview
//               w={"md"}
//               isUserMessage={isUserMessage}
//               isMessageError={isMessageError || isMessageBlocked}
//               isDownloadable={true}
//               mediaItems={message.MessageMediaItems}
//             ></MessageMediaItemsPreview>
//           )}

//           {/* Message */}
//           {message.Message && (
//             <TextMessageBubble
//               maxW={"md"}
//               message={message.Message}
//               isUserMessage={isUserMessage}
//               isClientMessage={!isUserMessage}
//               isMessageError={isMessageError || isMessageBlocked}
//             ></TextMessageBubble>
//           )}

//           {/* Meta */}
//           <HStack justifyContent="center" alignItems="center">
//             {messageType && messageType === "compliance" && (
//               <HStack color="gray.400">
//                 <Icon as={ScaleIcon}></Icon>
//                 <Text fontSize="sm">Compliance</Text>
//               </HStack>
//             )}
//             {messageType && messageType === "autoreply" && (
//               <HStack color="gray.400">
//                 <Icon as={BoltIcon}></Icon>
//                 <Text fontSize="sm">Auto Reply</Text>
//               </HStack>
//             )}
//             {messageCampaignId && messageDispatchId && (
//               <Button
//                 size="xs"
//                 onClick={handleViewCampaign}
//                 variant="outline"
//                 bg="white"
//                 aria-label="View campaign"
//                 leftIcon={<Icon as={ArrowUpRightIcon}></Icon>}
//               >
//                 View Dispatch
//               </Button>
//             )}
//             {messageBroadcastId && (
//               <Button
//                 size="xs"
//                 onClick={handleViewBroadcast}
//                 variant="outline"
//                 bg="white"
//                 aria-label="View broadcast"
//                 leftIcon={<Icon as={ArrowUpRightIcon}></Icon>}
//               >
//                 View Broadcast
//               </Button>
//             )}

//             <HStack fontSize="md" color="gray.400">
//               {isMessageBlocked && <Text>Number is unsubscribed</Text>}
//               <Text>{runFormatMinuteTime(message.CreatedTime)}</Text>
//             </HStack>
//           </HStack>
//         </Stack>
//       </Stack>
//     </>
//   );
// };

export default ConversationMessage
