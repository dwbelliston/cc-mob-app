const en = {
  common: {
    ok: "OK!",
    cancel: "Cancel",
    back: "Back",
    myNumber: "My Number",
    mySubscription: "My Subscription",
    myCCNumber: "CurrentClient Number",

  },
  fieldLabels: {
    lastname: "Last Name",
    email: "Email",
    password: "Password",
    rememberDevice: "Remember login"
  },
  inbox: {
    unread: "Unread",
    active: "Active",
    closed: "Closed",
    inbox: "Inbox",

  },
  loginScreen: {
    login: "Login",
    enter: "Please Login",
    createAccount: "Create Account",
    resetPassword: "Reset Password",
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
    profileTab: "Profile",
    contactsTab: "Contacts",
    inboxTab: "Inbox",
    campaigns: "Campaigns",
    broadcasts: "Broadcasts",
    notifications: "Notifications",
    feedback: "Feedback",
    signout: "Sign out",
    settings: "Settings",
  },
}

export default en
export type Translations = typeof en
