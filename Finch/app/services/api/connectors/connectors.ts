export const connectorsKeys = {
  all: ["connectors"] as const,
  lists: () => [...connectorsKeys.all, 'list'] as const,
  list: () => [...connectorsKeys.lists()] as const,
  details: () => [...connectorsKeys.all, 'detail'] as const,
  detail: (id: string) => [...connectorsKeys.details(), id] as const,
}
