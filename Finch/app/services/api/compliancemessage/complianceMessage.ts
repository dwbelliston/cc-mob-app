export const complianceMessageKeys = {
  all: ["complianceMessage"] as const,
  read: () => [...complianceMessageKeys.all, 'read'] as const,
}
