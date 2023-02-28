



export const tagsKeys = {
  all: ["tags"] as const,
  lists: () => [...tagsKeys.all, 'list'] as const,
  list: () => [...tagsKeys.lists()] as const,
  details: () => [...tagsKeys.all, 'detail'] as const,
  detail: (id: string) => [...tagsKeys.details(), id] as const,
}
