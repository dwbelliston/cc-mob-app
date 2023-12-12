import { runFormatTimeFromNow } from "../utils/useFormatDate"

const PAID_SUBSCRIPTION_STATUS = ["active"]
const ACTIVE_SUBSCRIPTION_STATUS = ["active", "trialing"]
const TRIAL_SUBSCRIPTION_STATUS = ["trialing"]
const INACTIVE_SUBSCRIPTION_STATUS = ["inactive", "canceled"]

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
  IsTeamsActive: boolean
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
  IsTeamMember?: boolean // if team member account, we do things different
  TeamMemberUserId?: string // if team member account, this is the cognito user id for the team member
}

export interface IUserProfile extends IUserProfileBase {
  UserId: string
  PartnerId: string
  CreatedAt: string
  // Billing
  Billing: IBilling
  // Branding
  BrandImageUrl?: string
  // Integrations?: IIntegrations;
  // Number
  RegisteredNumber?: IRegisteredNumber
  MessagingServiceId?: string
  Milestones?: IMilestones
  // Governance?: { [organizationId: string]: IUserGovernance };
  // Legal
  IsLegalSubmitted?: boolean
  IsLegalProcessing?: boolean
  IsLegalRegistered?: boolean
  IsDeleteRequested?: boolean
  // Some additional vals for the member users
  AdminEmail?: string
  AdminFirstName?: string
  AdminLastName?: string
  AdminBrandImageUrl?: string
  AdminImageUrl?: string
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

export const useIsAccountPaid = (userProfile: IUserProfile): boolean => {
  let isAccountActive = false

  if (userProfile && userProfile.Billing && userProfile.Billing.SubscriptionStatus) {
    if (PAID_SUBSCRIPTION_STATUS.includes(userProfile.Billing.SubscriptionStatus)) {
      isAccountActive = true
    }
  }

  return isAccountActive
}

export const useIsAccountActive = (userProfile: IUserProfile): boolean => {
  let isAccountActive = false

  if (
    userProfile &&
    userProfile.Billing &&
    userProfile.Billing.SubscriptionStatus &&
    userProfile.Billing.SubscriptionId
  ) {
    if (ACTIVE_SUBSCRIPTION_STATUS.includes(userProfile.Billing.SubscriptionStatus)) {
      isAccountActive = true
    }
  }

  return isAccountActive
}
export const useIsAccountTrial = (userProfile: IUserProfile): boolean => {
  let isAccountTrial = false

  if (userProfile && userProfile.Billing && userProfile.Billing.SubscriptionStatus) {
    if (TRIAL_SUBSCRIPTION_STATUS.includes(userProfile.Billing.SubscriptionStatus)) {
      isAccountTrial = true
    }
  }

  return isAccountTrial
}
export const useIsAccountInactive = (userProfile: IUserProfile): boolean => {
  let isAccountInactive = false

  if (userProfile && userProfile.Billing && userProfile.Billing.SubscriptionStatus) {
    if (INACTIVE_SUBSCRIPTION_STATUS.includes(userProfile.Billing.SubscriptionStatus)) {
      isAccountInactive = true
    }
  }

  return isAccountInactive
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

export const useSubscriptionEndsFromNow = (userProfile: IUserProfile): string => {
  let subscriptionEndFromNow = ""

  if (userProfile && userProfile.Billing && userProfile.Billing.CurrentPeriodEndTime) {
    subscriptionEndFromNow = runFormatTimeFromNow(userProfile.Billing.CurrentPeriodEndTime)
  }

  return subscriptionEndFromNow
}

export const runGetDefaultAdminUserName = (userProfile?: IUserProfile): string | undefined => {
  // If its a teammember, the admins name is on the profile
  // if its not an admin, then its just the profile name
  let userName

  if (userProfile) {
    if (userProfile.IsTeamMember) {
      userName = `${userProfile.AdminFirstName} ${userProfile.AdminLastName}`
    } else {
      userName = `${userProfile.FirstName} ${userProfile.LastName}`
    }
  }

  return userName
}

export const runGetTeammemberUserId = (userProfile?: IUserProfile): string | undefined => {
  let teammemberUserId = userProfile?.UserId

  if (userProfile && userProfile.IsTeamMember) {
    teammemberUserId = userProfile.TeamMemberUserId
  }

  return teammemberUserId
}

export const runGetDefaultAdminBrandImageUrl = (userProfile?: IUserProfile): string | undefined => {
  // If its a teammember, the admins name is on the profile
  // if its not an admin, then its just the profile name
  let brandImageUrl = userProfile?.BrandImageUrl

  if (userProfile && userProfile.IsTeamMember) {
    brandImageUrl = userProfile.AdminBrandImageUrl
  }

  return brandImageUrl
}

export const runGetUserName = (userProfile?: IUserProfile): string | undefined => {
  let userName

  if (userProfile) {
    userName = `${userProfile.FirstName} ${userProfile.LastName}`
  }

  return userName
}

export const useIsAdminMember = (userProfile?: IUserProfile): boolean => {
  let isAdmin = true

  if (userProfile?.IsTeamMember) {
    isAdmin = false
  }

  return isAdmin
}
