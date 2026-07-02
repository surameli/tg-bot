export default function registerHelpCommand(bot) {

  bot.help(async (ctx) => {
    await ctx.reply(
      `*Available Commands*\n\n` +
      `/start    — 🏠 Go to main menu\n` +
      `/register — 📝 Register as a tutor\n` +
      `/help     — ❓ Show this message\n` +
      `/cancel   — ❌ Cancel current registration`,
      { parse_mode: "Markdown" }
    );
  });

}
