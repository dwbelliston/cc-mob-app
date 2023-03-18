const ACTIVE_SUBSCTIPTION_STATUS = ["active"]

export const INDUSTRY_FIELDS: Array<string> = [
  "Financial Services",
  "Tax Planning",
  "Estate Planning",
  "Health Insurance/Medicare",
  "Multiline Insurance",
  "Real Estate",
  "Lending",
  "Other",
]

export const INDUSTRY_FIELDS_READYMADE_OPTIONS = [
  {
    label: "General",
    value: "General",
    colorScheme: "gray",
  },
  {
    label: "Financial Services",
    value: "FinancialServices",
    colorScheme: "teal",
  },
  {
    label: "Tax Planning",
    value: "TaxPlanning",
    colorScheme: "fuchsia",
  },
  {
    label: "Estate Planning",
    value: "EstatePlanning",
    colorScheme: "cyan",
  },
  {
    label: "Health Insurance/Medicare",
    value: "HealthInsurance/Medicare",
    colorScheme: "indigo",
  },
  {
    label: "Multiline Insurance",
    value: "MultilineInsurance",
    colorScheme: "amber",
  },
  // {
  //   label: "Real Estate",
  //   value: "RealEstate",
  // },
  // {
  //   label: "Lending",
  //   value: "Lending",
  // },
]
export const CRM_FIELDS: Array<string> = [
  "Active Campaign",
  "AdvisorBranch",
  "AgencyBloc",
  "AgentCRM",
  "AgentCore",
  "AirTable",
  "Excel",
  "EzLynx",
  "HubSpot",
  "Keap",
  "RadiusBob",
  "Redtail",
  "SalesForce",
  "Simplii",
  "WealthBox",
  "Other",
]

export interface IRegisteredNumberCapabilities {
  IsMMSEnabled: boolean
  IsSMSEnabled: boolean
  IsVoiceEnabled: boolean
}

export interface IUserProfileUpdateForm {
  FirstName?: string
  LastName?: string
  Phone?: string
  CompanyName?: string
  Address1?: string
  Address2?: string
  City?: string
  State?: string
  Zip?: string
  BrandImageUrl?: string
  IsDeleteRequested?: boolean
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
  IsVoiceActive?: boolean
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
  PrimaryOrganizationId?: string
  PrimaryOrganizationName: string
  SecondaryOrganizationId?: string
  SecondaryOrganizationName?: string
  Industry: string
  Crm?: string
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
  MessagingServiceId?: string
  CallForwarding?: ICallForwarding
  Milestones?: IMilestones
  // Governance?: { [organizationId: string]: IUserGovernance }
  IsDeleteRequested?: boolean
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
