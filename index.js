import 'dotenv/config';
import { Client, GatewayIntentBits, ChannelType } from 'discord.js';

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;

function getInGameTimeName() {
  const now = new Date();

  const time = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Etc/GMT+2', // UTC-02:00
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(now);

  return `🕒 In-Game Time • ${time}`;
}

async function updateChannel() {
  try {
    const channel = await client.channels.fetch(CHANNEL_ID);

    if (!channel || channel.type !== ChannelType.GuildVoice) {
      console.log('Channel not found or not a voice channel.');
      return;
    }

    const newName = getInGameTimeName();

    if (channel.name !== newName) {
      await channel.setName(newName);
      console.log(`Updated channel to: ${newName}`);
    }
  } catch (error) {
    console.error('Error updating channel:', error);
  }
}

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`);
  await updateChannel();

  setInterval(updateChannel, 10 * 60 * 1000);
});

client.login(TOKEN);