export enum ChannelType {
  IM = 'im'
};

export enum FeedbackType {
  POSITIVE = 'positive',
  NEGATIVE = 'negative',
  QUESTION = 'question'
}

export interface SlackEvent {
  channel_type: ChannelType;
  text: string;
  channel: string;
  user: string;
}