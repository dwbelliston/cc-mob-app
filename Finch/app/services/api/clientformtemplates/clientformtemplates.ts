export const clientformtemplatesKeys = {
  all: ["clientformtemplates"] as const,
  lists: () => [...clientformtemplatesKeys.all, 'list'] as const,
  list: () => [...clientformtemplatesKeys.lists()] as const,
}
