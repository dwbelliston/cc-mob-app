import React from "react"
import * as Sentry from "sentry-expo"

import appConfig from "../../app-config"

Sentry.init({
  dsn: "https://717adc2e0ba64378bcf3e98ade1f2abc@o1097451.ingest.sentry.io/4504889220792320",
  // enableNative: false,
  // autoInitializeNativeSdk: false,
  enableInExpoDevelopment: false,
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production.
  tracesSampleRate: 1.0,
  debug: appConfig.isDev ? true : false, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
})

const SentryProvider = ({ children }: { children: any }) => {
  return <>{children}</>
}

export { SentryProvider }
