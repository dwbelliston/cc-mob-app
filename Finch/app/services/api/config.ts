export enum APIEndpoints {
  authenticatedUsers = "authenticatedUsers",
  publicUsers = "publicUsers",
  authenticatedOutbounds = "authenticatedOutbounds",
  private = "private",
  public = "public",
}

enum QueryKeysEnum {
  userprofile = "userprofile",
  blockednumbers = "blockednumbers",
  conversations = "conversations",
  advocateprofile = "advocateprofile",
  consentFiles = "consentFiles",
}

export class QueryKeys {
  static userprofile(): string[] {
    return [QueryKeysEnum.userprofile]
  }

  static conversations(): string[] {
    return [QueryKeysEnum.conversations]
  }

  static conversationsList({
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

  static blockednumbers(): string[] {
    return [QueryKeysEnum.blockednumbers]
  }

  static blockednumbersList({
    pageLimit,
    pageNumber,
    search,
  }): string[] {
    return [QueryKeysEnum.blockednumbers, pageLimit, pageNumber, search]
  }
}
