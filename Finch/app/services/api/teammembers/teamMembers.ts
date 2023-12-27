export const teamMembersKeys = {
  all: ["teamMembers"] as const,
  lists: () => [...teamMembersKeys.all, 'list'] as const,
  list: () => [...teamMembersKeys.lists()] as const,
  me: () => [...teamMembersKeys.all, 'me'] as const,
  details: () => [...teamMembersKeys.all, 'detail'] as const,
  detail: (id: string) => [...teamMembersKeys.details(), id] as const,
}
