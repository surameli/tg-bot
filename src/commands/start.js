import { Markup } from "telegraf";

export default function registerStartCommand(bot) {

  // ── Set the Telegram command menu (the "/" button in the input bar) ────────
  bot.telegram.setMyCommands([
    { command: "start",    description: "🏠 Go to main menu" },
    { command: "register", description: "📝 Register as a tutor" },
    { command: "help",     description: "❓ Show available commands" },
    { command: "cancel",   description: "❌ Cancel current registration" },
  ]);

  // ── /start handler ─────────────────────────────────────────────────────────
  bot.start(async (ctx) => {

    const firstName = ctx.from?.first_name || "there";

    await ctx.reply(
      `👋 Welcome, ${firstName}!\n\nI'm *Fidel Tutor Bot* — connecting parents with qualified tutors.\n\nWhat would you like to do?`,
      {
        parse_mode: "Markdown",
        ...Markup.keyboard([
          ["📚 Register as Tutor", "👨‍👩‍👧 Register as Parent"],
          ["❓ Help",              "❌ Cancel"],
        ])
        .resize(),
      }
    );

  });

}
