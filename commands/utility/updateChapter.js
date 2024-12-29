const { SlashCommandBuilder } = require("discord.js");
const { updateChapter } = require("../../googleSheets");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("updatechapter")
    .setDescription("Update what chapter you're on")
    .addStringOption((option) =>
      option.setName("title").setDescription("Manga Title").setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("chapter")
        .setDescription("Manga Chapter")
        .setRequired(true)
    ),
  async execute(interaction) {
    const title = interaction.options.getString("title").toLowerCase();

    const chapter = interaction.options.getString("chapter").toLowerCase();

    try {
      const response = await updateChapter(title, chapter);
      await interaction.reply(
        `Successfully updated ${title} to chapter ${chapter}`
      );
    } catch (error) {
      console.log(`Failed to update chapter : ${error.message}`);
      await interaction.reply(
        `Error updating chatper to spreadsheet ${error.message}`
      );
    }
  },
};
