const dotenv = require("dotenv");
const fs = require("node:fs");
const path = require("node:path");
const { Client, Collection, Events, GatewayIntentBits } = require("discord.js");
const { getMangaOfTheDay } = require("./googleSheets");

dotenv.config();

// Create a new client instance
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

client.commands = new Collection();

const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

const channelID = process.env.CHANNEL_ID;

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Send Manga update message
const sendMessage = async () => {
  const today = new Date().getDay();
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const mangasOfTheDay = await getMangaOfTheDay(days[today]);

  // maybe just add client.on('ready' here)
  const channel = client.channels.cache.get(channelID);

  if (channel) {
    const permissions = channel.permissionsFor(client.user);
    if (!permissions.has("SEND_MESSAGES")) {
      console.log(
        `[ERROR] Bot does not have permission to send messages in the channel: ${channelID}`
      );
      return;
    }
  }

  if (mangasOfTheDay && channel) {
    for (const manga of mangasOfTheDay) {
      const { name, chapter, link, day, description, image } = manga;
      const mangaEmbedMsg = {
        color: 0x0099ff,
        title: `${name} updated on ${day}`,
        url: link,
        description: description,
        fields: [
          {
            name: "Chapter",
            value: chapter,
          },
          {
            name: "Release Day",
            value: day,
          },
        ],
        image: {
          url: image,
        },
        timestamp: new Date().toISOString(),
      };

      channel.send({ embeds: [mangaEmbedMsg] });
      await delay(2000);
    }
  }
};

// send a message every two minutes
// setInterval(sendMessage, 2 * 60 * 1000);

const timeUntilOneAm = () => {
  const now = new Date();
  const oneAm = new Date();
  oneAm.setHours(1, 0, 0, 0);

  return oneAm - now;
};

setTimeout(() => {
  // sends the first message
  sendMessage();

  // schedule the nexty messages every 24 hours
  setInterval(sendMessage, 24 * 60 * 60 * 1000); // 24 hours in milleseconds
}, timeUntilOneAm());

const token = process.env.DISCORD_TOKEN;
// Log in to Discord with your client's token
client.login(token);

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        flags: MessageFlags.Ephemeral,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        flags: MessageFlags.Ephemeral,
      });
    }
  }
});
