require('dotenv').config()
import { createEventAdapter } from '@slack/events-api';
import retroController from './retroController';


const SIGNING_SECRET = process.env.SLACK_SIGNING_SECRET;
const PORT = process.env.PORT || 3000;
const slackEvents = createEventAdapter(SIGNING_SECRET);

// When we @ retrobot and say start it should DM everyone for their feedback - DONE
// Allow people to send positives, negatives and questions to the slack bot
// Slackbot should write them somewhere lightweight - text file in S3 probably or IN MEMORY
// Send the feedback to the person who originally initiated the @start
// Once we are about to start, we just tell retro bot to spit out the output to developers or retro channel using @retrobot stop

// handlers
slackEvents.on('app_mention', retroController.retroBotMentioned);

slackEvents.on('message', retroController.acceptRetroFeedbackFromUser)

slackEvents.on('error', console.error);

// Start slack events server
slackEvents.start(PORT).then(function startServer() {
  console.log(`retro-slackbot server listening on port ${PORT}`);
});