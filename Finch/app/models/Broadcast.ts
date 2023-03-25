import { IMessageMediaItem } from "./Message";
import { IPaginatedResponse } from "./PaginatedResponse";

export enum BroadcastStatusEnum {
  DRAFT = "DRAFT",
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  ARCHIVED = "ARCHIVED",
}

export interface IBroadcast {
  BroadcastId: string;
  UserId: string;
  Title: string;
  Description: string;
  IsLoadingClientbroadcasts: boolean;
  IsSendingBroadcast: boolean;
  UserNumber?: string;
  MessagingServiceId?: string;
  IsDirtyBroadcast: boolean;
  AudioUrl: string;
  Status: BroadcastStatusEnum;
  CreatedAt: string;
  UpdatedAt?: string;
  MessageBody?: string;
  MessageMediaItems?: IMessageMediaItem[];
  ReportedAttemptedAt?: string;
  ReportBroadcastId?: string;
  ReportStatus?: string;
  StatSendComplete: number;
  StatSendError: number;
  StatSendNonMobile: number;
}

export interface IPaginatedBroadcasts extends IPaginatedResponse {
  records: IBroadcast[];
}

export interface ICreateBroadcastForm {
  Title: string;
  Description: string;
  FlowMessageBody?: string;
  FlowSegmentId?: string;
}

export interface IBroadcastUpdate {
  Title?: string;
  Description?: string;
  MessageBody?: string;
  MessageMediaItems?: IMessageMediaItem[];
  Status?: BroadcastStatusEnum;
}






// User can send dispatch
export const evalIsAllowBroadcastSendDispatch = (
  broadcast: IBroadcast
): boolean => {
  let isActionResponse = false;

  if (broadcast && [BroadcastStatusEnum.ACTIVE].includes(broadcast.Status)) {
    isActionResponse = true;
  }

  return isActionResponse;
};

export const evalIsBroadcastInDraft = (broadcast: IBroadcast): boolean => {
  let isResult = false;

  if (broadcast && [BroadcastStatusEnum.DRAFT].includes(broadcast.Status)) {
    isResult = true;
  }

  return isResult;
};

export const evalIsBroadcastInActive = (broadcast: IBroadcast): boolean => {
  let isResult = false;

  if (broadcast && [BroadcastStatusEnum.ACTIVE].includes(broadcast.Status)) {
    isResult = true;
  }

  return isResult;
};

export const evalIsBroadcastComplete = (broadcast: IBroadcast): boolean => {
  // If broadcast is in a completed state

  let isResult = false;

  if (
    broadcast &&
    [BroadcastStatusEnum.COMPLETED, BroadcastStatusEnum.ARCHIVED].includes(
      broadcast.Status
    )
  ) {
    isResult = true;
  }

  return isResult;
};

export const isBroadcastEditable = (broadcast: IBroadcast): boolean => {
  let isEditable = true;

  if (broadcast && broadcast.Status !== BroadcastStatusEnum.DRAFT) {
    isEditable = false;
  }

  return isEditable;
};
