require('dotenv').config()
import { createEventAdapter } from '@slack/events-api';
import retroController from './retroController';

const SIGNING_SECRET = process.env.SLACK_SIGNING_SECRET;
const PORT = process.env.PORT || 3000;
const slackEvents = createEventAdapter(SIGNING_SECRET);

// handlers
slackEvents.on('app_mention', retroController.retroBotMentioned);

slackEvents.on('message', retroController.acceptRetroFeedbackFromUser)

slackEvents.on('error', console.error);

// Start slack events server
slackEvents.start(PORT).then(function startServer() {
  console.log(`retro-slackbot server listening on port ${PORT}`);
});