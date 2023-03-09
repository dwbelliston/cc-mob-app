export const smsTemplatesKeys = {
  all: ["smsTemplates"] as const,
  lists: () => [...smsTemplatesKeys.all, 'list'] as const,
  list: () => [...smsTemplatesKeys.lists()] as const,
}
