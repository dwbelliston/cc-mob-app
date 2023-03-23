# cc-mob-app



## Sentry

https://docs.expo.dev/build-reference/variables/#using-secrets-in-environment-variables

eas secret:create --scope project --name SENTRY_AUTH_TOKEN --value FOUND IN SENTRY INTEGRAION --type string
eas secret:create --scope project --name SENTRY_ORG --value currentclient --type string

## Push tokens

curl --location --request \ --data-raw '{ "to": "ExponentPushToken[yweGepNjx7JGZEGESNv6bR]", "title":"Testing", "body": "Testing body", "content-available": 1, "_contentAvailable": true, "data": { "type": "testType" } }'


curl -X POST https://exp.host/--/api/v2/push/send \
   -H 'Content-Type: application/json' \
   -d '{"to":"ExponentPushToken[yweGepNjx7JGZEGESNv6bR]","title":"Testing0004","body":"body","content-available":5, "_contentAvailable": true}'