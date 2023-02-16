const ACTIVE_SUBSCTIPTION_STATUS = ["active"]

export const INDUSTRY_FIELDS: Array<string> = [
  "Financial Services",
  "Tax Planning",
  "Estate Planning",
  "Health Insurance/Medicare",
  "Multiline Insurance",
  "Real Estate",
  "Lending",
  "Other  ",
]

export interface IRegisteredNumberCapabilities {
  IsMMSEnabled: boolean
  IsSMSEnabled: boolean
  IsVoiceEnabled: boolean
}

export interface IRegisteredNumber {
  Description: string
  FriendlyName: string
  PhoneNumber: string
  Capabilities: IRegisteredNumberCapabilities
  AddressRequirements?: string
  IsoCountry?: string
  PostalCode?: string
  RateCenter?: string
  Region?: string
  DateCreated?: string
  Origin?: string
}

export interface IBilling {
  StripeCustomerId?: string
  BillingType?: string
  SubscriptionId?: string
  SubscriptionStatus?: string
  ProductName?: string
  ProductDescription?: string
  CreatedTime?: string
  CurrentPeriodStartTime?: string
  CurrentPeriodEndTime?: string
  CanceledAtTime?: string
  CancelAtTime?: string
}

export interface IActiveSubscriptionFeatures {
  IsTextDispatchActive: boolean
  IsTextConversationActive: boolean
  IsTextBroadcastActive: boolean
  IsVoicemailDropActive: boolean
}

export interface ICallForwarding {
  IsEnabled?: boolean
  IsOnboardingConfirm?: boolean
  NumberForwardTo?: string
}

export interface IMilestones {
  IsCompletedOnboarding?: boolean
}

export interface IMilestonesForm {
  IsCompletedOnboarding: boolean
}

export interface IUserProfileBase {
  // Person details
  FirstName: string
  LastName: string
  CompanyName: string
  Industry: string
  Email: string
  Phone: string
  // Address
  Address1?: string
  Address2?: string
  UploadId?: string
  City?: string
  State?: string
  Zip?: string
}

export interface IUserProfile extends IUserProfileBase {
  UserId: string
  PartnerId: string
  CreatedAt: string
  // Billing
  Billing: IBilling
  // Branding
  BrandImageUrl?: string
  // Number
  IsPhoneRegistered: boolean
  RegisteredNumber?: IRegisteredNumber
  CallForwarding?: ICallForwarding
  Milestones?: IMilestones
}

export interface IUserProfileForm {
  firstName: string
  lastName: string
  phone: string
  email: string
  companyName: string
  industry: string
  address1: string
  city: string
  state: string
  zip: string
}

export const intialFormUserProfile: IUserProfileForm = {
  firstName: "",
  lastName: "",
  phone: "",
  companyName: "",
  industry: "",
  email: "",
  address1: "",
  city: "",
  state: "",
  zip: "",
}

export interface IUserProfileCallForwardingForm {
  NumberForwardTo: string
  IsOnboardingConfirm: boolean
  IsEnabled: boolean
}

export const initialFormUserProfileCallForwarding: IUserProfileCallForwardingForm = {
  NumberForwardTo: "",
  IsOnboardingConfirm: true,
  IsEnabled: true,
}

export const transformToApi = ({
  firstName,
  lastName,
  phone,
  email,
  companyName,
  industry,
  address1,
  city,
  state,
  zip,
}: IUserProfileForm): IUserProfileBase => {
  return {
    FirstName: firstName,
    LastName: lastName,
    Phone: phone,
    CompanyName: companyName,
    Industry: industry,
    Email: email,
    Address1: address1,
    City: city,
    State: state,
    Zip: zip,
  }
}

export const transformFromApi = ({
  FirstName,
  LastName,
  Email,
  CompanyName,
  Industry,
  Phone = "",
  Address1 = "",
  City = "",
  State = "",
  Zip = "",
}: IUserProfileBase) => {
  return {
    firstName: FirstName,
    lastName: LastName,
    phone: Phone || "",
    companyName: CompanyName || "",
    industry: Industry || "",
    email: Email || "",
    address1: Address1 || "",
    city: City || "",
    state: State || "",
    zip: Zip || "",
  }
}

// Maybe add a class in the future? Cant think of a need now
// export class Contact implements IUserProfile {
//   public FirstName: string
//   public LastName: string
//   public Phone: string
//   public Email: string
//   constructor(
//     firstName: string,
//     lastName: string,
//     phone: string,
//     email: string
//   ) {
//     this.FirstName = firstName
//     this.LastName = lastName
//     this.Phone = phone
//     this.Email = email
//   }
// }
// const person: IContact = new Contact('John', 'Doe', 44);

export const useIsAccountActive = (userProfile: IUserProfile): boolean => {
  let isAccountActive = false

  if (userProfile && userProfile.Billing && userProfile.Billing.SubscriptionStatus) {
    if (ACTIVE_SUBSCTIPTION_STATUS.includes(userProfile.Billing.SubscriptionStatus)) {
      isAccountActive = true
    }
  }

  return isAccountActive
}

export const useIsHasSubscription = (userProfile: IUserProfile): boolean => {
  let isHasSubscription = false

  if (userProfile && userProfile.Billing && userProfile.Billing.SubscriptionId) {
    if (userProfile.Billing.SubscriptionId !== null) {
      isHasSubscription = true
    }
  }

  return isHasSubscription
}

export const useIsHasPhone = (userProfile: IUserProfile): boolean => {
  let isHasPhone = false

  if (userProfile && userProfile.RegisteredNumber && userProfile.RegisteredNumber.PhoneNumber) {
    isHasPhone = true
  }

  return isHasPhone
}

export const useIsHasCallForwarding = (userProfile: IUserProfile): boolean => {
  let isHasCallForwarding = false

  if (
    userProfile?.CallForwarding?.NumberForwardTo &&
    userProfile?.CallForwarding?.IsOnboardingConfirm
  ) {
    isHasCallForwarding = true
  }

  return isHasCallForwarding
}

export const useIsHasCompletedOnboarding = (userProfile: IUserProfile): boolean => {
  let isHasCompletedOnboarding = false

  if (userProfile?.Milestones?.IsCompletedOnboarding) {
    isHasCompletedOnboarding = true
  }

  return isHasCompletedOnboarding
}

export const useUserInitials = (userProfile: IUserProfile | undefined): string => {
  let initials = ""

  if (userProfile) {
    const fI = userProfile?.FirstName?.charAt(0)
    const lI = userProfile?.LastName?.charAt(0)
    initials = `${fI}${lI}`
  }

  return initials
}

export const useUserName = (userProfile: IUserProfile | undefined): string => {
  let name = ""
  if (userProfile) {
    const fI = userProfile?.FirstName
    const lI = userProfile?.LastName
    name = `${fI} ${lI}`
  }

  return name
}

export const useUserPhone = (userProfile: IUserProfile): string => {
  return userProfile?.RegisteredNumber?.PhoneNumber
}
