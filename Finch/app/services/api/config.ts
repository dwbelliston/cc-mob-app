export enum APIEndpoints {
  authenticatedUsers = "authenticatedUsers",
  publicUsers = "publicUsers",
  authenticatedOutbounds = "authenticatedOutbounds",
  private = "private",
  public = "public",
}

enum QueryKeysEnum {
  userprofile = "userprofile",
  conversations = "conversations",
  advocateprofile = "advocateprofile",
  consentFiles = "consentFiles",
}

export class QueryKeys {
  static userprofile(): string[] {
    return [QueryKeysEnum.userprofile]
  }
  static conversations({
    pageLimit,
    search,
    isUnread,
    fromFolderId,
    conversationStatus
  }): string[] {
    return [QueryKeysEnum.conversations, pageLimit, search, isUnread, fromFolderId,conversationStatus]
  }
  static conversationsDetailComplete(userconversationsId: string = ""): string[] {
    return [QueryKeysEnum.conversations, userconversationsId, "complete"]
  }
  static conversationssDetail(conversationsId: string = ""): string[] {
    return [QueryKeysEnum.conversations, conversationsId]
  }
  static advocateprofile(): string[] {
    return [QueryKeysEnum.advocateprofile]
  }
  static consentFiles(): string[] {
    return [QueryKeysEnum.consentFiles]
  }
}
