// import { useMutation } from "@tanstack/react-query";
// import { API } from "aws-amplify";
// import { AxiosError } from "axios";
// import {
//   IAdvocateProfile,
//   IAdvocateProfileRegister,
// } from "../../../../models/AdvocateProfile";
// import { APIEndpoints } from "../../config";

// const makeApiRequest = (
//   bodyIn: IAdvocateProfileRegister
// ): Promise<IAdvocateProfile> => {
//   const postData = {
//     body: {
//       ...bodyIn,
//     },
//   };

//   return API.post(
//     APIEndpoints.public,
//     "/api/v1/public/advocate/register-token",
//     postData
//   );
// };

// const useCreateAdvocateProfile = () => {
//   return useMutation<
//     IAdvocateProfile,
//     AxiosError,
//     IAdvocateProfileRegister,
//     unknown
//   >((userSignup) => makeApiRequest(userSignup), {
//     // useErrorBoundary: true,
//     retry: 2,
//   });
// };

// export default useCreateAdvocateProfile;
