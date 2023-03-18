export const crmSyncKeys = {
  all: ["crmSync"] as const,
  details: () => [...crmSyncKeys.all, 'detail'] as const,
  detail: (id: string) => [...crmSyncKeys.details(), id] as const,
}
