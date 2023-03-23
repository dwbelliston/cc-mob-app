



export const routingrulesKeys = {
  all: ["routingrules"] as const,
  lists: () => [...routingrulesKeys.all, 'list'] as const,
  list: () => [...routingrulesKeys.lists()] as const,
  details: () => [...routingrulesKeys.all, 'detail'] as const,
  detail: (id: string, isListVersions: boolean) => [...routingrulesKeys.details(), id, isListVersions] as const,
}
