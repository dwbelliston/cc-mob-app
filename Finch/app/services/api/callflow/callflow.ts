export const callflowKeys = {
  all: ["callflow"] as const,
  read: () => [...callflowKeys.all, 'read'] as const,
}
