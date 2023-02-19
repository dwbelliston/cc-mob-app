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
    completed: "Completed",
    activeHeader: "Inbox",
    unreadHeader: "Unread",
    completedHeader: "Completed",
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
    loadingConversations: "Loading More...",
  },
  loginScreen: {
    login: "Login",
    enter: "Please Login",
    enterAlt: "Alt Login",
    enterAltDescription: "If you have two accounts, you can use use this login form to save your other set of credentials for quick access.",
    createAccount: "Create Account",
    resetPassword: "Reset Password",
    altLogin: "Alt Login",
    backToLogin: "Back to primary login",
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
