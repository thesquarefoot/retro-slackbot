export enum ChannelType {
  IM = 'im'
};

export enum FeedbackType {
  POSITIVE = 'positive',
  NEGATIVE = 'negative',
  QUESTION = 'question'
}

export type Feedback = Partial<Record<FeedbackType, string[]>>; 

export interface SlackEvent {
  channel_type: ChannelType;
  text: string;
  channel: string;
  user: string;
}

export interface SlackApi {
  getChannelMembers: Function;
  sendDirectMessage: Function;
}