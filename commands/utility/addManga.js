const { SlashCommandBuilder } = require("discord.js");
const { appendManga } = require("../../googleSheets");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("addmanga")
    .setDescription("add manga to the data sheet")
    .addStringOption((option) =>
      option.setName("title").setDescription("Manga Title").setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("chapter")
        .setDescription("Manga Chapter")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("link").setDescription("Manga Link").setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("day")
        .setDescription("Day of new release")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("description")
        .setDescription("What this about?")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("image").setDescription("Image url").setRequired(true)
    ),
  async execute(interaction) {
    const title = interaction.options.getString("title");
    const chapter = interaction.options.getString("chapter");
    const link = interaction.options.getString("link");
    const day = interaction.options.getString("day");
    const description = interaction.options.getString("description");
    const image = interaction.options.getString("image");

    try {
      const response = await appendManga([
        title,
        chapter,
        link,
        day,
        description,
        image,
      ]);
      await interaction.reply(`Successfully added ${title} to manga sheet`);
    } catch (error) {
      await interaction.reply(
        `Error adding your manga to spreadsheet ${error.message}`
      );
    }
  },
};
