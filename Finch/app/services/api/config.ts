export enum APIEndpoints {
  authenticatedUsers = "authenticatedUsers",
  publicUsers = "publicUsers",
  private = "private",
  public = "public",
}

enum QueryKeysEnum {
  surveys = "surveys",
  advocateprofile = "advocateprofile",
  userprofile = "userprofile",
  consentFiles = "consentFiles",
}

export class QueryKeys {
  static surveys(): string[] {
    return [QueryKeysEnum.surveys]
  }
  static surveyDetailComplete(usersurveyId: string = ""): string[] {
    return [QueryKeysEnum.surveys, usersurveyId, "complete"]
  }
  static surveysDetail(surveyId: string = ""): string[] {
    return [QueryKeysEnum.surveys, surveyId]
  }
  static userprofile(): string[] {
    return [QueryKeysEnum.userprofile]
  }
  static advocateprofile(): string[] {
    return [QueryKeysEnum.advocateprofile]
  }
  static consentFiles(): string[] {
    return [QueryKeysEnum.consentFiles]
  }
}
