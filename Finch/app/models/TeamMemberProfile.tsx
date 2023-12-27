import * as Yup from "yup"
import { REGEX_PHONE } from "../utils/constants"

export interface ITeamMemberProfile {
  // Person details
  FirstName: string
  LastName: string
  Email: string
  Phone?: string
  TeamMemberId: string
  BrandImageUrl?: string
}

export interface ITeamMemberProfileUpdate {
  // Person details
  FirstName?: string
  LastName?: string
  Phone?: string
  BrandImageUrl?: string
}

export interface ITeamMemberProfileForm {
  FirstName: string
  LastName: string
  Email: string
  Phone?: string
}

export const TeamMemberProfileSchema = Yup.object().shape({
  FirstName: Yup.string().required("Required"),
  LastName: Yup.string().required("Required"),
  Email: Yup.string().email("Please use name@domain.com pattern").required("Required"),
  Phone: Yup.string().matches(REGEX_PHONE, "Use 10 digit phone").nullable(),
})

export const intialFormTeamMemberProfile: ITeamMemberProfileForm = {
  FirstName: "",
  LastName: "",
  Email: "",
  Phone: "",
}
