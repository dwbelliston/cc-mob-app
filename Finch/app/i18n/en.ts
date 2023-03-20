const en = {
  common: {
    ok: "OK!",
    cancel: "Cancel",
    back: "Back",
    myNumber: "My Number",
    mySubscription: "My Subscription",
    myCCNumber: "CurrentClient Number",
    loading: "Loading...",
    oneMoment: "One moment...",
    reset: "Reset",
    noValue: "No value",
    removeMedia: "Remove Media",
    downloadMedia: "Download Media",
    compliance: "Compliance",
    areYouSure: "Are you sure?",
    save: "Save",
    "saved": "Saved",
    "created!": "Created!",
    tapToEdit: "Tap to edit",
    complete: "Complete",
    inProgress: "In Progess",
    supported: "Supported",
    notSupported: "Not Supported",
    active: "Active",
    inActive: "Inactive",
    delete: "Delete",
    deleted: "Deleted",
    create: "Create",
    new: "New",
    edit: "Edit",
    supportedSoon: "Support Coming Soon",
    enabled: "Enabled",
  },
  fieldLabels: {
    name: "Name",
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email",
    password: "Password",
    rememberDevice: "Remember login",
    phone: "Phone",
    message: "Message",
    birthdate: "Birthdate",
    address: "Address",
    addressSte: "Address #",
    city: "City",
    state: "State",
    zip: "Zip",
    tags: "Tags",
    sourceType: "Source Type",
    companyName: "Company Name",
    createdAt: "Assigned At",
    registrationStatus: "Registration Status",
    supportsMMS: "MMS messages",
    supportsVoice: "Voice features",
    assignedOn: "Assigned On",
    title: "Title",
    number: "Number",
    template: "Template",
    code: "Code",
    newPassword: "New Password",
    confirmPassword: "Confirm Password",
  },

  inbox: {
    unread: "Unread",
    active: "Active",
    completed: "Completed",
    activeHeader: "Inbox",
    unreadHeader: "Unread",
    completedHeader: "Completed",
    selectFilter: "Select Inbox Filter",
    inbox: "Inbox",
    noUnreadTitle: "You are all caught up!",
    noUnreadDescription: "Change the inbox view on the top right to view Active or Completed conversations",
    noSearchTitle: "Nothing found",
    noSearchDescription: "Clear your search and try again",
    noActiveTitle: "Everything is completed",
    noActiveDescription: "Well done staying on top of the conversations. Take a minute to get outside and get some fresh air!",
    noCloseTitle: "No conversations",
    noCloseDescription: "When you are ready to mark a conversation complete swipe the conversation to change its status.",
    endOfConversations: "End of History",
    enterMessage: "Enter message...",
    voicemail: "Voicemail",
    recording: "Recording",
    transcript: "Transcript",
    contactCard: "Contact Card",
    startOfConversation: "Start of Conversation",
  },
  stream: {
    noMessages: "No Messages",
    noMessagesDescription: "Send a message to start the converstion",
  },
  broadcasts: {
    viewBroadcast: "View Broadcast",
  },
  campaigns: {
    viewCampaign: "View Campaign",
  },
  message: {
    sending: "Sending...",
    compliance: "Compliance",
    autoreply: "Auto Reply",
  },
  phone: {
    landline: "Landline",
    mobile: "Mobile",
    voip: "Voip",
    invalid: "Invalid number",
    unknown: "Unknown phone type",
  },
  contact: {
    information: "Information",
    address: "Address"
  },
  contacts: {
    noDataTitle: "No contacts yet!",
    noDataDescription: "Head over to the desktop app to run an import or sync with a CRM.",
    noSearchTitle: "Nothing found",
    noSearchDescription: "Clear your search and try again",
    loadingContacts: "Getting contacts...",
    backToContacts: "Back to contacts",
  },
  loginScreen: {
    login: "Login",
    enter: "Please Login",
    enterAlt: "Alt Login",
    enterAltDescription: "If you have two accounts, you can use use this login form to save your other set of credentials for quick access.",
    createAccount: "Create Account",
    enterResetCode: "Have a code already? Enter here",
    forgotPassword: "Forgot password?",
    resetPassword: "Reset Password",
    resetPasswordDescription: "Enter your email and we will send you a verification code you can use to reset your password.",
    resetPasswordConfirm: "New Password",
    resetPasswordConfirmDescription: "Use the code from your email to set a new password.",
    altLogin: "Alt Login",
    backToLogin: "Back to primary login",
    passwordRequirements: "Password needs to include",
    uppercase: "1 Uppercase",
    lowercase: "1 Lowercase",
    symbol: "1 Symbol",
    number: "1 Number",
    pleaseImprovePassword: "Please improve password",
  },
  welcomeScreen: {
    postscript:
      "hey there",
    readyForLaunch: "Your app, almost ready for launch!",
    exciting: "(ohh, this is exciting!)",
  },
  errorScreen: {
    title: "Something went wrong!",
    friendlySubtitle:
      "This is the screen that your users will see in production when an error is thrown. You'll want to customize this message (located in `app/i18n/en.ts`) and probably the layout as well (`app/screens/ErrorScreen`). If you want to remove this entirely, check `app/app.tsx` for the <ErrorBoundary> component.",
    reset: "RESET APP",
  },
  emptyStateComponent: {
    generic: {
      heading: "So empty... so sad",
      content: "No data found yet. Try clicking the button to refresh or reload the app.",
      button: "Let's try this again",
    },
  },
  navigator: {
    homeTab: "Home",
    profile: "Profile",
    contactsTab: "Contacts",
    inboxTab: "Inbox",
    campaigns: "Campaigns",
    broadcasts: "Broadcasts",
    notifications: "Notifications",
    feedback: "Feedback",
    signout: "Sign out",
    settings: "Settings",
  },
  settings: {
    myProfile: "My Profile",
    editProfile: "Edit Profile",
    phone: "Phone Configuration",
    myPhone: "My Phone",
    mySubscription: "My Subscription",
    helpCenter: "Help Center",
    business: "Resources",
    privacy: "Privacy",
    leaveReview: "Leave a review",
    account: "Account",
    currentClient: "CurrentClient",
    compliance: "Compliance",
    callForwarding: "Call Forwarding",
    businessHours: "Business Hours",
    autoReplies: "Auto Replies",
    voicemail: "Voicemail",
    logOut: "Log out",
    contacts: "Contacts",
    tags: "Tags",
    segments: "Segments",
    uploads: "Uploads",
    blocked: "Blocked numbers",
    crmSync: "CRM Sync",
    history: "History",
    library: "Library",
    smsTemplates: "SMS Templates",
    savedMedia: "Saved Media",
    shortUrls: "Shortened Urls",
    noBlockedNumbers: "Blocked Numbers",
    noBlockedNumbersDescription: "Nice! You don't have any blocked numbers.",
    blockedNumbersReachOut: "It's not personal",
    blockedNumbersReachOutMore: "Often clients just didnt recognize the number.",
    deleteAccount: "Delete Account",
    deleteAccountSub: "You are about to start the process for deleting your account.",
    deleteAccountExplainConfirm: "Type Delete to continue",
    deleteAccountExplain: "We understand that sometimes things just dont work out. We wish you the very best success in everything you do! If you would like to proceed in deleting your account then you can start the process by confirming below.\n\nOnce you submit, your account will begin to be deleted and you will receive a confirmation from the CurrentClient support team that the deletion is complete.\n\nIf you would like to keep your phone number and port it to another service, please let us know and we are happy to assist you in that!\n\nThe process will take up to 2 weeks to complete.",
    requestComplete: "Request complete",
    deleteRequestedHelp: "Please reach out to us if you have any questions at admin@currentclient.com",
    numberDetails: "Details about your number",
    numberDetailsInfo: "If you would like to change your number, please reach out to us:\nadmin@currentclient.com",
  },
  billing: {
    pageHeader: "Details about your subscription",
    pageSubheader: "CurrentClient uses a very popular online payment provider called Stripe to handle all of our billing. We do not store credit cards or charge them.",
    billingType: "Billing Type",
    subscriptionStatus: "Subscription Status",
    productName: "Product Name",
    productDescription: "Description",
    createdAt: "Started",
    currentBillingIntervalStart: "Billing Cycle Start",
    currentBillingIntervalEnd: "Next Invoice Charge",
    canceledAt: "Canceled",
    willCancelAt: "Will Cancel",
    changePayment: "Change Payment",
    editSubscription: "Edit Subscription",
    failedToOpen: "Error Loading",
  },
  crmSync: {
    pageHeader: "CRM Sync",
    pageSubheader: "The easiest way to use CurrentClient is setting up a sync. Contacts will be synced from your CRM daily. CRM Sync should be setup on the desktop app.",
    createNew: "Set up connector",
    supportedCRMS: "Supported CRMs",
    activeSyncSource: "Sync Source",
    statusSync: "Sync Status",
    isAllowCreate: "Push new contacts to CRM",
    isAllowUpdate: "Push contact edits to CRM",
    isAllowNotes: "Add conversations as notes to CRM",
    edit: "Edit",
    enabled: "Enabled",
  },
  compliance: {
    pageHeader: "Compliance Message Setup",
    pageSubheader: "When a text is sent to a client's number for the very first time, we can automatically include a message that contains opt-in/opt-out language.",
    readMore: "Read more about the TCPA",
    enabled: "Enabled",
    autoSendMessage: "Auto Send Message",
    autoSendIsOn: "Auto send is active",
    autoSendIsOff: "Auto send is off",
    message: "Compliance Message",
    ideas: "Here are some ideas (tap to use)",
  },
  smsTemplates: {
    templates: "Templates",
    noTemplates: "No Templates",
    noTemplatesDescription: "Create templates in desktop app",
    editInfo:  "Save a message that can be reused from the inbox",
    editHint:  "You can use ${FirstName} in the template. When the template gets used, it will auto replace the first name of the contact if available.",
  },
  callforwarding: {
    pageHeader: "Call Forwarding",
    pageSubheader: "When a client calls your CurrentClient number, you can optionally have it forward to a different number. Notice, if you use this feature, you will not be able to use the voicemail and business hours features in CurrentClient.",
    status: "Call forwarding status",
    isOn: "Call forwarding is on",
    isOff: "Call forwarding is off",
    number:"Number to forward to"
  },
  businessHours: {
    pageHeader: "Business Hours",
    pageSubheader: "Set up your business hours which then enable you to react to incoming message or calls depending on your business schedule.",
    turnOnHours:"Turn on hours",
    businessHours: "Business Hours",
    isOn: "Hours are on",
    isOff: "Hours are off",
    timezone: "Timezone",
    selectTimezone: "Select Timezone",
  }
}

export default en
export type Translations = typeof en
