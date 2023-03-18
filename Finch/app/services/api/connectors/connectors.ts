export const connectorsKeys = {
  all: ["connectors"] as const,
  details: () => [...connectorsKeys.all, 'detail'] as const,
  detail: (id: string) => [...connectorsKeys.details(), id] as const,
}
