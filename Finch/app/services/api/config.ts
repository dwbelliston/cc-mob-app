
export enum APIEndpoints {
  authenticatedUsers = "authenticatedUsers",
  publicUsers = "publicUsers",
  authenticatedOutbounds = "authenticatedOutbounds",
  authenticatedShed = "authenticatedShed",
  authenticatedContacts = "authenticatedContacts",
  authenticatedCampaigns = "authenticatedCampaigns",
  private = "private",
  public = "public",
  teamMembers = "teamMembers",
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
