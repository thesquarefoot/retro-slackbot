import slackApi from './slackApi';
import { SlackEvent } from './types';
import Retrospective from './Retrospective';

const RETRO_CHANNEL_ID = process.env.RETRO_CHANNEL_ID;
const plusRgx = /^\+.*\n/igm;
const negRegex = /^\-.*\n/igm;
const questionRegex = /^\?.*\n/igm;

const retrospective = new Retrospective(slackApi);

async function startRetro(retroStartUser: string) {
  // Send a DM to anyone in a certain chat (retro), and ask them for their feedback
  const members = await slackApi.getChannelMembers(RETRO_CHANNEL_ID);
  members.forEach(member => {
    slackApi.sendDirectMessage(
      member,
      `Hi there - I'm the SquareFoot RetroBot. Please send your retro feedback to me. Prefix each of your feedback items with one of the following:
      + Positive - Something that went well this sprint
      - Negative - Something you think could have gone better this sprint.
      ? Questions - Questions or items you would like to discuss with the wider team.`
    );
  });
  // Reset the current retro in memory 
  retrospective.start(retroStartUser);
}

async function retroBotMentioned(event: SlackEvent) {
  if (event.channel !== RETRO_CHANNEL_ID) return;

  // if it contains (start) only then call startRetro
  if (/.*start$/.test(event.text)) {
    console.log('You said start to the bot')
    startRetro(event.user);
    return;
  }

  // if it contains (finish) only then call captureRetro
  if (/.*finish$/.test(event.text)) {
    console.log('You said finish to the bot')
    await retrospective.finish();
    return;
  }

  await slackApi.sendDirectMessage(
    RETRO_CHANNEL_ID,
    'I dont understand. I only understand the *stop* and *start* commands.'
  );
}

function acceptRetroFeedbackFromUser(event: SlackEvent) {
  // ensure that the retro is started
  console.log(retrospective.inProgress, event);
  if (!retrospective.inProgress || event.user === 'UHZ4Q520L') return;
  // make sure there's at least one +, - or ? in the text
    // if not, throw and tell the user to try again
  // if it's fine, start parsing and storing into the data structure

  const feedback = {
    positive: event.text.match(plusRgx), 
    negative: event.text.match(negRegex), 
    question: event.text.match(questionRegex), 
  };


  retrospective.storeFeedback(feedback);
  console.log(feedback)
}

export default {
  retroBotMentioned,
  acceptRetroFeedbackFromUser
};