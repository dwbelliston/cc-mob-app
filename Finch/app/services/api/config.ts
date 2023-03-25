
export enum APIEndpoints {
  authenticatedUsers = "authenticatedUsers",
  publicUsers = "publicUsers",
  authenticatedOutbounds = "authenticatedOutbounds",
  authenticatedContacts = "authenticatedContacts",
  authenticatedCampaigns = "authenticatedCampaigns",
  private = "private",
  public = "public",
}

enum QueryKeysEnum {
  blockednumbers = "blockednumbers",
  advocateprofile = "advocateprofile",
  consentFiles = "consentFiles",
}


export class QueryKeys {
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
