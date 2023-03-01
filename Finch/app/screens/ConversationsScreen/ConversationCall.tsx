/*
ConversationMessage
*/

import { View } from "native-base"
import React from "react"
import { Text } from "../../components"
import { CallDirectionEnum, ICall } from "../../models/Call"

interface IProps {
  call: ICall
  contactName: string
}

const ConversationCall = ({ call, contactName }: IProps) => {
  const [isUserCall, set_isOutboundCall] = React.useState(
    call.Direction === CallDirectionEnum.OUTBOUND,
  )

  return (
    <View borderWidth={4} borderColor={"green.100"}>
      <Text text={contactName}></Text>
      <Text text={call.CallId}></Text>
    </View>
  )

  // const { userProfile } = useAuth();

  // React.useEffect(() => {
  //   set_isOutboundCall(call.Direction === CallDirectionEnum.OUTBOUND);
  // }, [call]);

  // return (
  //   <>
  //     <Stack
  //       spacing={2}
  //       alignItems="flex-start"
  //       direction={isUserCall ? "row-reverse" : "row"}
  //     >
  //       {/* Gutter */}
  //       <HStack mt={1}>
  //         {isUserCall ? (
  //           <Avatar
  //             src={`${userProfile?.BrandImageUrl}`}
  //             name={`${userProfile.FirstName} ${userProfile.LastName}`}
  //             size="md"
  //           ></Avatar>
  //         ) : (
  //           <Avatar name={contactName} size="md"></Avatar>
  //         )}
  //       </HStack>

  //       {/* Container */}
  //       <Stack alignItems={isUserCall ? "flex-end" : "flex-start"} spacing={2}>
  //         <Box
  //           w="lg"
  //           p={2}
  //           rounded="lg"
  //           shadow={"sm"}
  //           py={3}
  //           px={4}
  //           bg={isUserCall ? "primary.50" : "white"}
  //           borderColor={isUserCall ? "primary.200" : "gray.200"}
  //           borderWidth="1px"
  //           whiteSpace={"pre-wrap"}
  //         >
  //           <Stack spacing={2}>
  //             <HStack spacing={4}>
  //               <CallStatus.Icon
  //                 status={call.Status}
  //                 direction={call.Direction}
  //               ></CallStatus.Icon>

  //               <Stack spacing={0} flex={1}>
  //                 <HStack justify={"space-between"}>
  //                   <CallStatus.Description
  //                     fontSize="lg"
  //                     status={call.Status}
  //                   ></CallStatus.Description>
  //                   <CallStatus.Forwarded
  //                     color="gray.500"
  //                     fontSize="sm"
  //                     call={call}
  //                   ></CallStatus.Forwarded>
  //                   <CallStatus.OutideHours
  //                     color="gray.500"
  //                     fontSize="sm"
  //                     call={call}
  //                   ></CallStatus.OutideHours>
  //                 </HStack>

  //                 <HStack
  //                   spacing={2}
  //                   divider={<Circle h="1" w="1" bg="gray.500"></Circle>}
  //                 >
  //                   <CallDirection.Description
  //                     color="gray.500"
  //                     status={call.Direction}
  //                   ></CallDirection.Description>
  //                   {call.CallDurationTime && call.CallDurationTime !== "0" && (
  //                     <CallDuration
  //                       color="gray.500"
  //                       duration={call.CallDurationTime}
  //                     ></CallDuration>
  //                   )}
  //                 </HStack>
  //               </Stack>
  //             </HStack>

  //             {call.TranscriptionText && (
  //               <Stack spacing={1}>
  //                 <Text textStyle={"propertyLabel"}>Voicemail</Text>
  //                 <Text>{call.TranscriptionText}</Text>
  //               </Stack>
  //             )}

  //             {call.RecordingUrl && (
  //               <Stack spacing={1}>
  //                 <Text textStyle={"propertyLabel"}>Recording</Text>

  //                 <AudioPlayer
  //                   py={0}
  //                   px={0}
  //                   source={call.RecordingUrl}
  //                 ></AudioPlayer>
  //               </Stack>
  //             )}
  //           </Stack>
  //         </Box>

  //         {/* Meta */}
  //         <HStack justifyContent="center" alignItems="center">
  //           <HStack fontSize="md" color="gray.400">
  //             <Text>{runFormatMinuteTime(call.CreatedTime)}</Text>
  //           </HStack>
  //         </HStack>
  //       </Stack>
  //     </Stack>
  //   </>
  // );
}

export default ConversationCall
