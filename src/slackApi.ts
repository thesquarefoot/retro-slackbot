import axios from 'axios';

const ACCESS_TOKEN = process.env.SLACK_ACCESS_TOKEN;
const SLACK_API_URL = 'https://slack.com/api';

async function getChannelMembers(channel: string): Promise<string[]> {
  const response = await axios({
    url: `${SLACK_API_URL}/channels.info`,
    method: 'GET',
    params: {
      token: ACCESS_TOKEN,
      channel
    }
  });
  return response.data.channel.members;
}

async function sendDirectMessage(userId: string, message: string): Promise<any> {
  const response = await axios({
    url: `${SLACK_API_URL}/chat.postMessage`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Accept': 'application/json',
      'Authorization': `Bearer ${ACCESS_TOKEN}`    
    },
    data: {
      channel: userId,
      text: message,
      as_user: true
    }
  })
  return response.data;
}

export default {
  getChannelMembers,
  sendDirectMessage
};