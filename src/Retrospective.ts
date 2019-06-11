import { FeedbackType } from './types';

class Retrospective {
  public inProgress: boolean;
  private feedback: Record<FeedbackType, string[]>;
  private retroStartUser: String;
  private slackApi: any;

  constructor(slackApi: object) {
    this.inProgress = false;
    this.feedback = {
      positive: [],
      negative: [],
      question: []
    }
    this.slackApi = slackApi;
  }

  start(retroStartUser: string) {
    this.inProgress = true;
    this.retroStartUser = retroStartUser;
  }

  status() {
    // show the current status of the retro
  }

  async finish() {
    this.inProgress = false;
    const feedbackMessage = Object.keys(this.feedback).reduce((acc, next) => acc + this.feedback[next].join(''), '');
    this.slackApi.sendDirectMessage(this.retroStartUser, feedbackMessage);
  }

  storeFeedback(feedback: any) {
    this.feedback = {
      positive: [...this.feedback.positive, ...feedback.positive],
      negative: [...this.feedback.negative, ...feedback.negative],
      question: [...this.feedback.question, ...feedback.question],
    };
  }
}

export default Retrospective;