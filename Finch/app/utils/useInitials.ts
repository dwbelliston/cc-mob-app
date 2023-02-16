
  export function useInitials(name: string = ""): string {
    let initials = ""
    if (name) {
      const [firstName, lastName] = name.split(" ")
      initials = firstName && lastName
        ? `${firstName.charAt(0)}${lastName.charAt(0)}`
        : firstName.charAt(0)
    }

    return initials
  }
