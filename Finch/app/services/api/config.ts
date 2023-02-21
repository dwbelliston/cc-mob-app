
export enum APIEndpoints {
  authenticatedUsers = "authenticatedUsers",
  publicUsers = "publicUsers",
  authenticatedOutbounds = "authenticatedOutbounds",
  authenticatedContacts = "authenticatedContacts",
  private = "private",
  public = "public",
}

enum QueryKeysEnum {
  userprofile = "userprofile",
  blockednumbers = "blockednumbers",
  advocateprofile = "advocateprofile",
  consentFiles = "consentFiles",
}


export class QueryKeys {
  static userprofile(): string[] {
    return [QueryKeysEnum.userprofile]
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
