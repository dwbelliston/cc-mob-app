export interface ICrmSyncUpdate {
  IsEnabled: boolean
}

export interface ICrmSync extends ICrmSyncUpdate {
  UserId: string
  CrmSyncId: string
  CreatedAt: string
  IsAllowCreate: boolean
  IsAllowUpdate: boolean
  IsAllowNotes: boolean
  IsAllowSubmissionNote?: boolean
  ConnectorId: string
}

// In the form, we change it to allow mode
export interface ICrmSyncWorkingForm extends Partial<ICrmSyncUpdate> {}
