



export const rollcallKeys = {
  all: ["rollcall"] as const,
  online: () => [...rollcallKeys.all, 'online'] as const,
  lists: () => [...rollcallKeys.all, 'list'] as const,
  list: () => [...rollcallKeys.lists()] as const,
  details: () => [...rollcallKeys.all, 'detail'] as const,
  detail: (id: string, isListVersions: boolean) => [...rollcallKeys.details(), id, isListVersions] as const,
}
