const { SlashCommandBuilder } = require("discord.js");
const { getManga } = require("../../googleSheets");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("getmanga")
    .setDescription("Gets the specified manga data from the sheet")
    .addStringOption((option) =>
      option.setName("input").setDescription("Name of manga you want data on")
    ),
  async execute(interaction) {
    const mangaMap = await getManga();

    const input =
      interaction.options.getString("input").toLowerCase() ??
      "No manga provided";

    if (mangaMap.has(input)) {
      const manga = mangaMap.get(input);
      const { name, chapter, link, day, description, image } = manga;

      const mangaEmbedMsg = {
        color: 0x0099ff,
        title: name,
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
      await interaction.reply({ embeds: [mangaEmbedMsg] });
    } else {
      await interaction.reply("No info found for this manga :(");
    }
  },
};
