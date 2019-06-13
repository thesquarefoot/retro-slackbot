import { SlackApi, Feedback } from "./types";
import { RETRO_CHANNEL_ID } from "./constants";

class Retrospective {
  public inProgress: boolean;
  private feedback: Feedback;
  private retroStartUser: String;
  private slackApi: SlackApi;

  constructor(slackApi: SlackApi) {
    this.inProgress = false;
    this.feedback = {};
    this.slackApi = slackApi;
  }

  async start(retroStartUser: string) {
    const members = await this.slackApi.getChannelMembers(RETRO_CHANNEL_ID);
    members.forEach(member => {
      this.slackApi.sendDirectMessage(
        member,
        `Hi there - I'm the SquareFoot RetroBot. Please send your retro feedback to me. Prefix each of your feedback items with one of the following:
        + Positive - Something that went well this sprint
        - Negative - Something you think could have gone better this sprint.
        ? Questions - Questions or items you would like to discuss with the wider team.`
      );
    });
    this.feedback = {};
    this.retroStartUser = retroStartUser;
    this.inProgress = true;
  }

  status() {
    // show the current status of the retro
  }

  async finish() {
    const feedbackMessage = Object.keys(this.feedback).reduce(
      (acc, next) => acc + this.feedback[next].join('\n') + '\n',
      '' 
    );
    await this.slackApi.sendDirectMessage(this.retroStartUser, feedbackMessage);
    this.inProgress = false;
  }

  storeFeedback(feedback: Feedback) {
    this.feedback = {
      positive: [...this.feedback.positive || [], ...feedback.positive],
      negative: [...this.feedback.negative || [], ...feedback.negative],
      question: [...this.feedback.question || [], ...feedback.question]
    };
  }
}

export default Retrospective;
