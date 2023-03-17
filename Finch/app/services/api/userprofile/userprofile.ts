export const userprofileKeys = {
  all: ["userprofile"] as const,
  myProfile: () => [...userprofileKeys.all, 'myProfile'] as const,
}
