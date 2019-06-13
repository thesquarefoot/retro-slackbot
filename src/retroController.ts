import slackApi from './slackApi';
import { SlackEvent } from './types';
import Retrospective from './Retrospective';
import { RETRO_CHANNEL_ID, PLUS_RGX, NEG_RGX, QUESTION_RGX } from './constants';

const retrospective = new Retrospective(slackApi);

async function retroBotMentioned(event: SlackEvent) {
  if (event.channel !== RETRO_CHANNEL_ID) return;

  if (/.*start$/.test(event.text)) {
    await retrospective.start(event.user);
    return;
  }

  if (/.*finish$/.test(event.text)) {
    await retrospective.finish();
    return;
  }

  await slackApi.sendDirectMessage(
    RETRO_CHANNEL_ID,
    'I dont understand. I only understand the *stop* and *finish* commands.'
  );
}

async function acceptRetroFeedbackFromUser(event: SlackEvent) {
  if (!retrospective.inProgress || 'bot_id' in event) return;

  const feedback = {
    positive: event.text.match(PLUS_RGX), 
    negative: event.text.match(NEG_RGX), 
    question: event.text.match(QUESTION_RGX), 
  };

  retrospective.storeFeedback(feedback);
  await slackApi.sendDirectMessage(event.user, 'Thanks for your feedback!');
}

export default {
  retroBotMentioned,
  acceptRetroFeedbackFromUser
};